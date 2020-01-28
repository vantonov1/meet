package com.github.vantonov1.meet.service

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.github.vantonov1.meet.dto.EquityDTO
import com.github.vantonov1.meet.dto.LocationDTO
import com.github.vantonov1.meet.dto.PriceRangeDTO
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.entities.Equity
import com.github.vantonov1.meet.entities.Filter
import com.github.vantonov1.meet.entities.PriceRange
import com.github.vantonov1.meet.repository.EquityPriceRangeRepository
import com.github.vantonov1.meet.repository.EquityRepository
import com.github.vantonov1.meet.repository.LocationRepository
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import javax.annotation.PostConstruct

@Service
@DependsOn("liquibase")
class EquityService(
        private val equityRepository: EquityRepository,
        private val priceRangeRepository: EquityPriceRangeRepository,
        private val locationRepository: LocationRepository,
        private val districts: DistrictService,
        private val stations: SubwayService,
        private val photos: PhotoService) {

    fun save(dto: EquityDTO): Mono<Long> = equityRepository.save(dto.toEntity()).map { it.id!! }.doOnSuccess { photos.save(it, dto.photos) }

    fun findById(id: Long): Mono<EquityDTO> = Mono.zip(equityRepository.findById(id), photos.findByEquityId(id))
            .map { fromEntity(it.t1, districts.findById(it.t1.district), stations.findById(it.t1.subway), it.t2) }

    fun findByIds(ids: List<Long>): Mono<List<EquityDTO>> = Mono.zip(equityRepository.findAllById(ids).collectList(), photos.findAllByEquityId(ids))
            .map {
                it.t1.sortBy { it.price }
                it.t1.map { e -> fromEntity(e, districts.findById(e.district), stations.findById(e.subway), it.t2[e.id]?.map { p -> p.id }) }
            }

    fun find(f: Filter): Flux<LocationDTO> {
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

    fun delete(id: Long, hide: Boolean?): Mono<Void> = if (hide != null && hide) equityRepository.hide(id) else equityRepository.deleteById(id)

    fun getPriceRange(f: Filter): Mono<PriceRangeDTO> {
        val entity: Mono<PriceRange> = if (f.district == null && f.subway == null) {
            priceRangeRepository.getPriceRange(f.type, f.city)
        } else if (f.district == null) {
            priceRangeRepository.getPriceRangeWithSubway(f.type, f.city, f.subway!!)
        } else if (f.subway == null) {
            priceRangeRepository.getPriceRangeWithDistrict(f.type, f.city, f.district)
        } else {
            priceRangeRepository.getPriceRangeWithDistrictAndSubway(f.type, f.city, f.district, f.subway)
        }
        return entity.map { PriceRangeDTO(it.minPrice, it.maxPrice) }
    }

    @PostConstruct
    @Suppress("unused")
    private fun loadFakeEquities() {
        val equities = jacksonObjectMapper().readValue(javaClass.getResource("/fake_equities.json"), object : TypeReference<List<Equity>>() {})
        equityRepository.saveAll(equities).subscribe()
    }
}