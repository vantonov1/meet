package com.github.vantonov1.meet.controller.auth

import com.github.vantonov1.meet.dto.AgentDTO
import com.github.vantonov1.meet.service.AdminService
import com.github.vantonov1.meet.service.AgentService
import org.springframework.security.authentication.InsufficientAuthenticationException
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
    fun invite(@RequestParam email: String, authentication: Authentication) =
            checkIsAdmin(authentication).then(agentService.invite())

    @PutMapping("/register")
    @Transactional
    fun register(@RequestParam invitation: String, @RequestBody dto: AgentDTO, authentication: Authentication) =
            agentService.register(dto, invitation, authentication)

    @PutMapping
    @Transactional
    fun update(@RequestBody dto: AgentDTO) = agentService.save(dto).then()

    @PutMapping("/active/{id}")
    @Transactional
    fun setActive(@PathVariable id: Int, @RequestParam active: Boolean) = agentService.setActive(id, active)

    @DeleteMapping("/{id}")
    @Transactional
    fun delete(id: Int) = agentService.delete(id)

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    fun findById(id: Int) = agentService.findById(id)

    @GetMapping
    @Transactional(readOnly = true)
    fun findAll() = agentService.findAll()

    private fun checkIsAdmin(authentication: Authentication) =
            if (adminService.isAdmin(authentication)) Mono.just(true)
            else throw InsufficientAuthenticationException("Требуются права администратора")

}