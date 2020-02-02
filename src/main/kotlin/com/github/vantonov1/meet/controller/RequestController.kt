package com.github.vantonov1.meet.controller

import com.github.vantonov1.meet.dto.RequestDTO
import com.github.vantonov1.meet.service.RequestService
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/v1/request")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class RequestController(private val requestService: RequestService) {
    @PostMapping
    @Transactional
    fun create(@RequestBody dto: RequestDTO): Mono<RequestDTO> = requestService.save(dto)

    @DeleteMapping("/{id}")
    @Transactional
    fun delete(@PathVariable id: Int) = requestService.delete(id)

    @GetMapping
    @Transactional(readOnly = true)
    fun findByPersons(@RequestParam(required = false) issuedBy: Int?,
                      @RequestParam(required = false) assignedTo: Int?) = requestService.findByPersons(issuedBy, assignedTo)
}