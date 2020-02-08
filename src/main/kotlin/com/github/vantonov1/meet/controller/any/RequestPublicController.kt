package com.github.vantonov1.meet.controller.any

import com.github.vantonov1.meet.dto.RequestDTO
import com.github.vantonov1.meet.service.RequestService
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/public/v1/request")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class RequestPublicController(private val requestService: RequestService) {
    @PostMapping
    @Transactional
    fun create(@RequestBody dto: RequestDTO): Mono<RequestDTO> = requestService.save(dto)
}