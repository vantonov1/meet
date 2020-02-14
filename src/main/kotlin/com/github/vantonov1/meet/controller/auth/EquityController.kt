package com.github.vantonov1.meet.controller.auth

import com.github.vantonov1.meet.dto.EquityDTO
import com.github.vantonov1.meet.service.EquityService
import com.github.vantonov1.meet.service.PhotoService
import com.github.vantonov1.meet.service.RequestService
import org.springframework.security.access.annotation.Secured
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/auth/v1/equities")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class EquityController(private val equities: EquityService,
                       private val photos: PhotoService,
                       private val requests: RequestService) {
    @PostMapping
    @Transactional
    @Secured("ROLE_AGENT")
    fun create(@RequestBody dto: EquityDTO, @RequestParam fromRequest: Int?): Mono<Long> {
        val equity = if (fromRequest != null) {
            requests.findById(fromRequest)
                    .flatMap { req -> equities.save(dto.copy(ownedBy = req?.issuedBy?.id, responsible = req?.assignedTo?.id)) }
        } else {
            equities.save(dto)
        }
        return equity.flatMap { requests.attachEquity(it!!, fromRequest) }
    }

    @PutMapping
    @Transactional
    @Secured("ROLE_AGENT")
    fun update(@RequestBody dto: EquityDTO): Mono<Void> =
            if (dto.id != null) equities.save(dto).then()
            else throw IllegalArgumentException("no equity id on update")

    @DeleteMapping("/{id}")
    @Transactional
    @Secured("ROLE_AGENT")
    fun delete(id: Long, @RequestParam hide: Boolean?) = equities.delete(id, hide)
}