package com.github.vantonov1.meet.service

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.github.vantonov1.meet.entities.District
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service

@Service
@DependsOn("liquibase")
class DistrictService {
    private val districts: List<District> = jacksonObjectMapper()
            .readValue(javaClass.getResource("/districts.json"), object : TypeReference<List<District>>() {})

    fun findById(id: Short?): District? = districts.find { it.id == id }

    fun findByName(district: String): District? = districts.find { it.name == district }

    fun findByCity(city: Short): List<District> = districts.filter { it.city == city }
}