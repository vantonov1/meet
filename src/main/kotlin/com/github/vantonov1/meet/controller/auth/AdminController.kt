package com.github.vantonov1.meet.controller.auth

import com.github.vantonov1.meet.service.AdminService
import org.springframework.security.access.annotation.Secured
import org.springframework.security.authentication.InsufficientAuthenticationException
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/auth/v1/admin")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class AdminController(val service: AdminService) {
    @PostMapping("/invite")
    @Secured("ROLE_ADMIN")
    fun invite(@RequestParam email: String, auth: Authentication) = service.invite(email)

    @PutMapping
    fun register(@RequestParam invitation: String, auth: Authentication) = service.register(invitation, auth)

    @GetMapping
    @Secured("ROLE_ADMIN")
    fun findAll(auth: Authentication) = service.findAll()

    private fun checkIsAdmin(authentication: Authentication) =
            if (service.isAdmin(authentication)) Mono.just(true)
            else throw InsufficientAuthenticationException("Требуются права администратора")

}