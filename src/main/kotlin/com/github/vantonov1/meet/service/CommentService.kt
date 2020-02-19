package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.CommentDTO
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.repository.CommentRepository
import org.springframework.stereotype.Service

@Service
class CommentService(val commentRepository: CommentRepository) {
    fun save(comment: CommentDTO) = commentRepository.save(comment.toEntity()).then()

    fun findCustomerCommentsByEquity(customer:Int, id: Long) = commentRepository.findCustomerCommentsByEquity(customer, id)
            .map { fromEntity(it) }
            .collectList()

    fun findSharedCommentsByEquities(ids: List<Long>) = commentRepository.findSharedCommentsByEquities(ids)
            .map { fromEntity(it) }
            .collectMultimap { it.about }
}