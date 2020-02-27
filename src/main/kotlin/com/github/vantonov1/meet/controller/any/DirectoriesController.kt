package com.github.vantonov1.meet.controller.any

import com.github.vantonov1.meet.service.DistrictService
import com.github.vantonov1.meet.service.SubwayService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/public/v1/dir")
@CrossOrigin("*")
@Suppress("unused")
class DirectoriesController(
        private val districtService: DistrictService,
        private val subwayService: SubwayService
) {
    @GetMapping("/districts/{city}")
    fun findDistricts(@PathVariable city: Short) = districtService.findByCity(city)

    @GetMapping("/subways/{city}")
    fun findSubways(@PathVariable city: Short) = subwayService.findByCity(city)
}