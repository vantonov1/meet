package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.entities.Subway
import com.github.vantonov1.meet.repository.SubwayRepository
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono
import javax.annotation.PostConstruct

const val MOSCOW: Short = 1
const val PETER: Short = 2
const val API = "https://api.hh.ru/metro"

@Service
@DependsOn("liquibase")
class SubwayService(val repository: SubwayRepository) {

    fun findById(id: Short?): String? {
        return if (id != null) repository.findById(id).map { it.name }.block() else null
    }

    fun findAll(): Mono<List<Short>> {
        return repository.findAll().map { it.id!! }.collectList()
    }

    @PostConstruct
    @Suppress("unused")
    private fun init() {
        repository.deleteAll().doOnSuccess {
            listOf(MOSCOW, PETER).forEach { loadCitySubwayFromHH(it) }
        }.subscribe()
    }

    private fun loadCitySubwayFromHH(city: Short) {
        WebClient.create().get().uri("$API/$city").retrieve().bodyToMono(CitySubway::class.java).subscribe { response ->
            response?.lines?.forEach { line ->
                repository.saveAll(line.stations.map { station ->
                    Subway(name = station.name, city = city, color = line.hex_color)
                }.toList())
            }
        }
    }
}

data class CitySubway(val id: Short, val name: String, val lines: List<SubwayLine>)
data class SubwayLine(val id: Int, val name: String, val hex_color: String, var stations: List<SubwayStation>)
data class SubwayStation(val id: String, val name: String)
