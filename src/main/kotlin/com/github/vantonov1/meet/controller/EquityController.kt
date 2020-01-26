package com.github.vantonov1.meet.controller

import com.github.vantonov1.meet.dto.EquityDTO
import com.github.vantonov1.meet.dto.LocationDTO
import com.github.vantonov1.meet.dto.PriceRangeDTO
import com.github.vantonov1.meet.entities.EquityType
import com.github.vantonov1.meet.entities.Filter
import com.github.vantonov1.meet.service.EquityService
import com.github.vantonov1.meet.service.PhotoService
import org.springframework.http.HttpStatus
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/v1/equities")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class EquityController(private val equities: EquityService, private val photos: PhotoService) {
    @PostMapping
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody dto: EquityDTO): Mono<Long> = equities.save(dto)

    @PutMapping
    @Transactional
    fun update(@RequestBody dto: EquityDTO): Mono<Void> =
            if (dto.id != null) equities.save(dto).then()
            else throw IllegalArgumentException("no equity id on update")

    @DeleteMapping("/{id}")
    @Transactional
    fun delete(id: Long, @RequestParam hide: Boolean?) = equities.delete(id, hide)

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