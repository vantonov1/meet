package com.github.vantonov1.meet.controler

import com.github.vantonov1.meet.dto.EquityDTO
import com.github.vantonov1.meet.dto.LocationDTO
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
            if(dto.equity.id != null) equities.save(dto).then()
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
            @RequestParam(required = false) district: List<Byte>?,
            @RequestParam(required = false) subway: List<String>?,
            @RequestParam(required = false) priceMin: Int?,
            @RequestParam(required = false) priceMax: Int?): Flux<LocationDTO> =
            equities.find(Filter(getTypes(type), district, subway, priceMin, priceMax))

    @GetMapping("/ids")
    @Transactional(readOnly = true)
    fun findByIds(@RequestParam ids: List<Long>) = equities.findByIds(ids)

    private fun getTypes(type: List<String>) =
            type.map { EquityType.valueOf(it).ordinal }.toList()
}