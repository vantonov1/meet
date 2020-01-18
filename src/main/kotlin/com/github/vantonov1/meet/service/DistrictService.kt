package com.github.vantonov1.meet.service

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.github.vantonov1.meet.entities.District
import com.github.vantonov1.meet.repository.DistrictsRepository
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import javax.annotation.PostConstruct

@Service
@DependsOn("liquibase")
class DistrictService(private val repository: DistrictsRepository) {
    fun findById(id: Byte?): String? {
        return if (id != null) repository.findById(id).map { it.name }.block() else null
    }

    fun findByName(district: String): Mono<District> = repository.findByName(district)

    fun findAll(): Mono<List<Byte>> {
        return repository.findAll().map { it.id!! }.collectList()
    }

    @PostConstruct
    @Suppress("unused")
    private fun init() {
        val ref: TypeReference<List<District>> = object : TypeReference<List<District>>() {}
        val districts: List<District> = jacksonObjectMapper().readValue(javaClass.getResource("/districts.json"), ref)
        repository.deleteAll().doOnSuccess { repository.saveAll(districts) }.subscribe()
    }

}