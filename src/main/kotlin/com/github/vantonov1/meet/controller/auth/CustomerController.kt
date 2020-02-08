package com.github.vantonov1.meet.controller.auth

import com.github.vantonov1.meet.dto.CustomerDTO
import com.github.vantonov1.meet.service.CustomerService
import org.springframework.http.HttpStatus
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/auth/v1/customer")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class CustomerController(private val customerService: CustomerService) {
    @PostMapping
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody dto: CustomerDTO): Mono<Int> = customerService.save(dto)

    @PutMapping
    @Transactional
    fun update(@RequestBody dto: CustomerDTO): Mono<Void> = customerService.save(dto).then()

    @DeleteMapping("/{id}")
    @Transactional
    fun delete(id: Int) = customerService.delete(id)

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    fun findById(id: Int): Mono<CustomerDTO> = customerService.findById(id)
}