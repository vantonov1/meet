package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.entities.Subway
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import javax.annotation.PostConstruct

const val MOSCOW: Short = 1
const val PETER: Short = 2
const val API = "https://api.hh.ru/metro"

@Service
@DependsOn("liquibase")
class SubwayService {
    var subways: List<Subway> = listOf()

    fun findById(id: String?): Subway? = if (id != null) subways.find {it.id == id} else null

    fun findByCity(city: Short): List<Subway> = subways.filter { it.city == city }

    @PostConstruct
    @Suppress("unused")
    private fun init() {
            listOf(MOSCOW, PETER).forEach { loadCitySubwayFromHH(it) }
    }

    private fun loadCitySubwayFromHH(city: Short) {
        WebClient.create().get().uri("$API/$city").retrieve().bodyToMono(CitySubway::class.java).subscribe {
            it?.lines?.forEach { line ->
                subways = subways + line.stations.map { station ->
                    Subway(id = station.id, name = station.name, city = city, color = line.hex_color)
                }.toList()
            }
        }
    }
}

data class CitySubway(val id: Short, val name: String, val lines: List<SubwayLine>)
data class SubwayLine(val id: Int, val name: String, val hex_color: String, var stations: List<SubwayStation>)
data class SubwayStation(val id: String, val name: String)
