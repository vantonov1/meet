package com.github.vantonov1.meet.controller.any

import com.github.vantonov1.meet.dto.EquityDTO
import com.github.vantonov1.meet.dto.LocationDTO
import com.github.vantonov1.meet.dto.PriceRangeDTO
import com.github.vantonov1.meet.entities.EquityType
import com.github.vantonov1.meet.entities.Filter
import com.github.vantonov1.meet.service.EquityService
import com.github.vantonov1.meet.service.PhotoService
import com.github.vantonov1.meet.service.RequestService
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/public/v1/equities")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class EquityPublicController(private val equities: EquityService,
                             private val photos: PhotoService,
                             private val requests: RequestService) {
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    fun findById(id: Long): Mono<EquityDTO> = equities.findById(id)

    @GetMapping
    @Transactional(readOnly = true)
    fun find(
            @RequestParam type: List<String>,
            @RequestParam(required = false) city: Short,
            @RequestParam(required = false) district: List<Short>?,
            @RequestParam(required = false) subway: List<String>?,
            @RequestParam(required = false) minPrice: Int?,
            @RequestParam(required = false) maxPrice: Int?
    ): Flux<LocationDTO> = equities.find(Filter(getTypes(type), city, district, subway, minPrice, maxPrice))

    @GetMapping("/address")
    @Transactional(readOnly = true)
    fun findByAddress(
            @RequestParam type: String,
            @RequestParam city: Short,
            @RequestParam street: String,
            @RequestParam(required = false) building: String?
    ): Flux<EquityDTO> = equities.findByAddress(EquityType.valueOf(type).value, city, street, building)

    @GetMapping("/ids")
    @Transactional(readOnly = true)
    fun findByIds(@RequestParam ids: List<Long>): Mono<List<EquityDTO>> = equities.findByIds(ids)

    @GetMapping("/prices")
    @Transactional(readOnly = true)
    fun getPriceRange(@RequestParam type: List<String>,
                      @RequestParam(required = false) city: Short,
                      @RequestParam(required = false) district: List<Short>?,
                      @RequestParam(required = false) subway: List<String>?
    ): Mono<PriceRangeDTO> = equities.getPriceRange(Filter(getTypes(type), city, district, subway, null, null))

    private fun getTypes(type: List<String>) =
            type.map { EquityType.valueOf(it).value }.toList()
}