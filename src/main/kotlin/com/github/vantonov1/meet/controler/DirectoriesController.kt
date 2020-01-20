package com.github.vantonov1.meet.controler

import com.github.vantonov1.meet.entities.District
import com.github.vantonov1.meet.service.DistrictService
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/v1/dir")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class DirectoriesController(private val districtService: DistrictService) {
    @GetMapping("/districts/{city}")
    fun findDistricts(@PathVariable city: Short): Mono<List<District>> = Mono.just(districtService.findByCity(city))
}