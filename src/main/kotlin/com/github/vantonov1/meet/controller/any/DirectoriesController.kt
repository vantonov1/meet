package com.github.vantonov1.meet.controller.any

import com.github.vantonov1.meet.entities.District
import com.github.vantonov1.meet.entities.Subway
import com.github.vantonov1.meet.service.DistrictService
import com.github.vantonov1.meet.service.SubwayService
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/public/v1/dir")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class DirectoriesController(
        private val districtService: DistrictService,
        private val subwayService: SubwayService
) {
    @GetMapping("/districts/{city}")
    fun findDistricts(@PathVariable city: Short): Mono<List<District>> = Mono.just(districtService.findByCity(city))

    @GetMapping("/subways/{city}")
    fun findSubways(@PathVariable city: Short): Mono<List<Subway>> = Mono.just(subwayService.findByCity(city))
}