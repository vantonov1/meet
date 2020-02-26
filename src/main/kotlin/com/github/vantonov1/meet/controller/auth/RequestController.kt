package com.github.vantonov1.meet.controller.auth

import com.github.vantonov1.meet.service.RequestService
import com.github.vantonov1.meet.service.impl.getAgentId
import org.springframework.security.access.annotation.Secured
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth/v1/request")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class RequestController(private val requestService: RequestService) {
    @PutMapping("/{id}")
    @Transactional
    @Secured("ROLE_AGENT")
    fun changeRequestEquity(@PathVariable id: Int, @RequestParam equityId: Long) = requestService.attachEquity(equityId, id)

    @PutMapping("/complete")
    @Transactional
    @Secured("ROLE_AGENT")
    fun completeRequest(@RequestParam sellId: Int,
                        @RequestParam buyId: Int,
                        @RequestParam equityId: Long,
                        @RequestParam contractNumber: String?
    ) = requestService.completeRequest(sellId, buyId, equityId, contractNumber)

    @DeleteMapping("/{id}")
    @Transactional
    fun delete(@PathVariable id: Int) = requestService.delete(id)

    @GetMapping
    @Transactional(readOnly = true)
    fun findByPersons(@RequestParam(required = false) issuedBy: Int?,
                      @RequestParam(required = false) assignedTo: Int?) =
        requestService.findByPersons(issuedBy, getAgentId())
}