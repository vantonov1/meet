package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Comment
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux

interface CommentRepository : ReactiveCrudRepository<Comment, Int> {
    @Query("select * from comment where created_by = :customer and about in (:ids)")
    fun findCustomerCommentsByEquities(customer: Int, ids: List<Long>): Flux<Comment>
   @Query("select * from comment where created_by = :customer and about = :id")
    fun findCustomerCommentsByEquity(customer: Int, id: Long): Flux<Comment>
}