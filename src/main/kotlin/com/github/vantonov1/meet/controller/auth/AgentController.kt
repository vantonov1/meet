package com.github.vantonov1.meet.controller.auth

import com.github.vantonov1.meet.dto.AgentDTO
import com.github.vantonov1.meet.service.AdminService
import com.github.vantonov1.meet.service.AgentService
import com.github.vantonov1.meet.service.impl.getAgentId
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.access.annotation.Secured
import org.springframework.security.core.Authentication
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/auth/v1/agent")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class AgentController(private val agentService: AgentService, private val adminService: AdminService) {
    @PostMapping("/invite")
    @Transactional
    @Secured("ROLE_ADMIN")
    fun invite(@RequestParam email: String, @RequestParam base: String) = agentService.invite(email, base)

    @PutMapping("/register")
    @Transactional
    fun register(@RequestParam invitation: String, @RequestBody dto: AgentDTO, authentication: Authentication) =
            agentService.register(dto, invitation, authentication)

    @PutMapping
    @Transactional
    @Secured("ROLE_AGENT")
    fun update(@RequestBody dto: AgentDTO) = getAgentId().flatMap {
        if (dto.id == it)
            agentService.save(dto).then()
        else
            Mono.error(AccessDeniedException("Не является владельцем"))
    }

    @PutMapping("/active/{id}")
    @Transactional
    @Secured("ROLE_AGENT")
    fun setActive(@PathVariable id: Int, @RequestParam active: Boolean) = getAgentId().flatMap {
        assert(id == it)
        agentService.setActive(it, active)
    }

    @DeleteMapping("/{id}")
    @Transactional
    @Secured("ROLE_ADMIN")
    fun delete(@PathVariable id: Int) = agentService.delete(id)

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    @Secured("ROLE_AGENT")
    fun findById(@PathVariable id: Int) = agentService.findById(id)

    @GetMapping
    @Transactional(readOnly = true)
    @Secured("ROLE_ADMIN")
    fun findAll() = agentService.findAll()
}