package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.EquityDTO
import com.github.vantonov1.meet.dto.LocationDTO
import com.github.vantonov1.meet.dto.PriceRangeDTO
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.entities.Filter
import com.github.vantonov1.meet.repository.EquityPriceRangeRepository
import com.github.vantonov1.meet.repository.EquityRepository
import com.github.vantonov1.meet.repository.LocationRepository
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import org.springframework.web.server.ServerWebInputException
import javax.annotation.PostConstruct

@Service
@DependsOn("liquibase")
class EquityService(
        private val equityRepository: EquityRepository,
        private val priceRangeRepository: EquityPriceRangeRepository,
        private val locationRepository: LocationRepository,
        private val districts: DistrictService,
        private val stations: SubwayService,
        private val photos: PhotoService,
        private val comments: CommentService
) {

    @CacheEvict(allEntries = true, cacheNames = ["equitiesByFilter"])
    fun save(dto: EquityDTO): Long {
        val saved = equityRepository.save(dto.toEntity())
        photos.save(saved.id!!, dto.photos)
        return saved.id
    }

    fun findById(id: Long): EquityDTO {
        val equity = equityRepository.findById(id)
        if (equity.isEmpty) throw ServerWebInputException("Объект не найден")
        return fromEntity(equity.get(), districts.findById(equity.get().district), stations.findById(equity.get().subway), null, null)
    }

    fun findByIds(ids: List<Long>): List<EquityDTO> {
        return if(ids.isNotEmpty()) {
            val equities = equityRepository.findAllById(ids)
            val photos = photos.findAllByEquityId(ids)
            val comments = comments.findSharedCommentsByEquities(ids)
            equities.map { e -> fromEntity(e, districts.findById(e.district), stations.findById(e.subway), photos[e.id]?.map { p -> p.id }, comments[e.id]) }
        } else
            listOf()
    }

    @Cacheable(cacheNames = ["equitiesByFilter"])
    fun find(f: Filter): List<LocationDTO> {
        val locations = if (f.district == null && f.subway == null) {
            locationRepository.find(f.type, f.city, f.priceMin ?: 0, f.priceMax ?: Int.MAX_VALUE)
        } else if (f.district == null) {
            locationRepository.findWithSubway(f.type, f.city, f.subway!!, f.priceMin ?: 0, f.priceMax ?: Int.MAX_VALUE)
        } else if (f.subway == null) {
            locationRepository.findWithDistrict(f.type, f.city, f.district, f.priceMin ?: 0, f.priceMax
                    ?: Int.MAX_VALUE)
        } else {
            locationRepository.findWithDistrictAndSubway(f.type, f.city, f.district, f.subway, f.priceMin
                    ?: 0, f.priceMax
                    ?: Int.MAX_VALUE)
        }
        return locations.map { LocationDTO(it.id!!, it.lat, it.lon) }
    }

    fun findByAddress(type: Byte, city: Short, street: String, building: String?): List<EquityDTO> {
        val equities = if (building.isNullOrEmpty())
            equityRepository.findByAddress(type, city, street)
        else
            equityRepository.findByAddress(type, city, street, building)
        return equities.map { fromEntity(it, districts.findById(it.district), stations.findById(it.subway), null, null) }
    }

    @CacheEvict(allEntries = true, cacheNames = ["equitiesByFilter"])
    fun delete(id: Long, hide: Boolean?) {
        if (hide != null && hide) equityRepository.hide(id) else equityRepository.deleteById(id)
    }

    fun getPriceRange(f: Filter): PriceRangeDTO {
        val entity = if (f.district == null && f.subway == null) {
            priceRangeRepository.getPriceRange(f.type, f.city)
        } else if (f.district == null) {
            priceRangeRepository.getPriceRangeWithSubway(f.type, f.city, f.subway!!)
        } else if (f.subway == null) {
            priceRangeRepository.getPriceRangeWithDistrict(f.type, f.city, f.district)
        } else {
            priceRangeRepository.getPriceRangeWithDistrictAndSubway(f.type, f.city, f.district, f.subway)
        }
        return PriceRangeDTO(entity.minPrice, entity.maxPrice)
    }

    @PostConstruct
    @Suppress("unused")
    private fun loadFakeEquities() {
//        val equities = jacksonObjectMapper().readValue(javaClass.getResource("/fake_equities.json"), object : TypeReference<List<Equity>>() {})
//        equityRepository.saveAll(equities)
    }
}