package com.github.vantonov1.meet.controller.auth

import com.github.vantonov1.meet.service.AdminService
import org.springframework.security.access.annotation.Secured
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth/v1/admin")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class AdminController(val service: AdminService) {
    @PostMapping("/invite")
    @Secured("ROLE_ADMIN")
    fun invite(@RequestParam email: String, @RequestParam base: String, auth: Authentication) = service.invite(email, base)

    @PutMapping
    fun register(@RequestParam invitation: String, auth: Authentication) = service.register(invitation, auth)

    @GetMapping
    @Secured("ROLE_ADMIN")
    fun findAll(auth: Authentication) = service.findAll()
}