package com.github.vantonov1.meet.controller.auth

import com.github.vantonov1.meet.service.impl.getFirebaseAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth/v1/authorities")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class AuthController {
    @PostMapping
    fun auth(authentication: Authentication) = getFirebaseAuthenticationToken(authentication).map { it.authorities }
}