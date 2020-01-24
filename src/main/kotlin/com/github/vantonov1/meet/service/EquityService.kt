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
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import javax.annotation.PostConstruct

@Service
@DependsOn("liquibase")
class EquityService(
        private val repository: EquityRepository,
        private val priceRangeRepository: EquityPriceRangeRepository,
        private val districts: DistrictService,
        private val stations: SubwayService,
        private val photos: PhotoService) {

    fun save(dto: EquityDTO): Mono<Long> = repository.save(dto.toEntity()).doOnSuccess { photos.save(it.id!!, dto.photos) }.map { it.id!! }

    fun findById(id: Long): Mono<EquityDTO> = Mono.zip(repository.findById(id), photos.findByEquityId(id))
            .map { fromEntity(it.t1, districts.findById(it.t1.district), stations.findById(it.t1.subway), it.t2) }

    fun findByIds(ids: List<Long>): Flux<EquityDTO> = repository.findAllById(ids)
            .map { fromEntity(it, districts.findById(it.district), stations.findById(it.subway), null) }

    fun find(f: Filter): Flux<LocationDTO> {
        val equities = if (f.district == null && f.subway == null) {
            repository.find(f.type, f.city, f.priceMin ?: 0, f.priceMax ?: Int.MAX_VALUE)
        } else if (f.district == null) {
            repository.findWithSubway(f.type, f.city,  f.subway!!, f.priceMin ?: 0, f.priceMax ?: Int.MAX_VALUE)
        } else if (f.subway == null) {
            repository.findWithDistrict(f.type, f.city, f.district, f.priceMin ?: 0, f.priceMax ?: Int.MAX_VALUE)
        } else {
            repository.findWithDistrictAndSubway(f.type,f.city, f.district, f.subway, f.priceMin ?: 0, f.priceMax
                    ?: Int.MAX_VALUE)
        }
        return equities.map { LocationDTO(it.id!!, it.lat, it.lon) }
    }

    fun delete(id: Long, hide: Boolean?): Mono<Void> = if (hide != null && hide) repository.hide(id) else repository.deleteById(id)

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
        repository.saveAll(equities).subscribe()
    }
}