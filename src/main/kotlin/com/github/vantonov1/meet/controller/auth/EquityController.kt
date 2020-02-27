package com.github.vantonov1.meet.controller.auth

import com.github.vantonov1.meet.dto.EquityDTO
import com.github.vantonov1.meet.service.EquityService
import com.github.vantonov1.meet.service.PhotoService
import com.github.vantonov1.meet.service.RequestService
import com.github.vantonov1.meet.service.impl.getAgentId
import org.springframework.security.access.annotation.Secured
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ServerWebInputException

@RestController
@RequestMapping("/api/auth/v1/equities")
@CrossOrigin("*")
@Suppress("unused")
class EquityController(private val equities: EquityService,
                       private val photos: PhotoService,
                       private val requests: RequestService) {
    @PostMapping
    @Transactional
    @Secured("ROLE_AGENT")
    fun create(@RequestBody dto: EquityDTO, @RequestParam fromRequest: Int?): Long {
        return if (fromRequest != null) {
            val request = requests.findById(fromRequest)
            val agentId = getAgentId()
            assert(agentId == request.assignedTo?.id)
            val id = equities.save(dto.copy(ownedBy = request.issuedBy!!.id, responsible = agentId))
            requests.attachEquity(id, fromRequest)
            id
        } else equities.save(dto)
    }

    @PutMapping
    @Transactional
    @Secured("ROLE_AGENT")
    fun update(@RequestBody dto: EquityDTO): Long =
            if (dto.id != null) equities.save(dto)
            else throw ServerWebInputException("no equity id on update")

    @DeleteMapping("/{id}")
    @Transactional
    @Secured("ROLE_AGENT")
    fun delete(id: Long, @RequestParam hide: Boolean?) = equities.delete(id, hide)
}