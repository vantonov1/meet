package com.github.vantonov1.meet.controller.auth

import com.github.vantonov1.meet.dto.CommentDTO
import com.github.vantonov1.meet.service.CommentService
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth/v1/comment")
@CrossOrigin("*")
@Suppress("unused")
class CommentController(private val commentService: CommentService) {
    @PostMapping
    @Transactional
    fun create(@RequestBody dto: CommentDTO) = commentService.save(dto)

    @GetMapping
    @Transactional(readOnly = true)
    fun findCustomerCommentsByEquity(@RequestParam customer: Int,
                                     @RequestParam equity: Long
    ) = commentService.findCustomerCommentsByEquity(customer, equity)
}