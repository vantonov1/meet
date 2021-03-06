package com.github.vantonov1.meet.controller

import com.github.vantonov1.meet.service.MessagingService
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth/v1/messaging")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class MessagingController(val service: MessagingService) {
    @PutMapping
    @Transactional
    fun registerToken(@RequestParam personId: Int, @RequestParam token: String) = service.registerToken(personId, token)
}