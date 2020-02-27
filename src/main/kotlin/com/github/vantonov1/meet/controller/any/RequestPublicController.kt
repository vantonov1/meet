package com.github.vantonov1.meet.controller.any

import com.github.vantonov1.meet.dto.RequestDTO
import com.github.vantonov1.meet.service.RequestService
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/public/v1/request")
@CrossOrigin("*")
@Suppress("unused")
class RequestPublicController(private val requestService: RequestService) {
    @PostMapping
    @Transactional
    fun create(@RequestBody dto: RequestDTO, @RequestParam(required = false) customerId: Int?)
            = requestService.save(dto, customerId)
}