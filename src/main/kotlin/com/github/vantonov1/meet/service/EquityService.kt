package com.github.vantonov1.meet.service

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.github.vantonov1.meet.dto.EquityDTO
import com.github.vantonov1.meet.dto.LocationDTO
import com.github.vantonov1.meet.entities.Equity
import com.github.vantonov1.meet.entities.Filter
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
        private val districts: DistrictService,
        private val stations: SubwayService,
        private val photos: PhotoService) {

    fun save(dto: EquityDTO): Mono<Long> = repository.save(dto.equity).doOnSuccess { photos.save(it.id!!, dto.photos) }.map { it.id!! }

    fun findById(id: Long): Mono<EquityDTO> = Mono.zip(repository.findById(id), photos.findByEquityId(id))
            .map {  EquityDTO(it.t1, districts.findById(it.t1.district)?.name, stations.findById(it.t1.subway)?.name, it.t2) }

    fun findByIds(ids: List<Long>): Flux<Equity> = repository.findAllById(ids)

    fun find(f: Filter): Flux<LocationDTO> {
        val equities = if(f.district == null && f.subway == null) {
            repository.find(f.type, f.priceMin ?: 0, f.priceMax ?: Int.MAX_VALUE)
        } else if(f.district == null) {
            repository.findWithSubway(f.type, f.subway!!,f.priceMin ?: 0, f.priceMax ?: Int.MAX_VALUE)
        } else if(f.subway == null) {
            repository.findWithDistrict(f.type, f.district,f.priceMin ?: 0, f.priceMax ?: Int.MAX_VALUE)
        } else {
            repository.findWithDistrictAndSubway(f.type, f.district, f.subway,f.priceMin ?: 0, f.priceMax ?: Int.MAX_VALUE)
        }
        return equities.map { LocationDTO(it.id!!, it.lat, it.lon) }
    }

    fun delete(id: Long, hide: Boolean?): Mono<Void> = if(hide != null && hide) repository.hide(id) else repository.deleteById(id)

    @PostConstruct
    @Suppress("unused")
    private fun loadFakeEquities() {
        val equities = jacksonObjectMapper().readValue(javaClass.getResource("/fake_equities.json"), object : TypeReference<List<Equity>>() {})
        repository.saveAll(equities).subscribe()
    }
}