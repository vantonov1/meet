package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Comment
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository

interface CommentRepository : CrudRepository<Comment, Int> {
    @Query("select * from comment where about in (:ids) and shared = true")
    fun findSharedCommentsByEquities(ids: List<Long>): List<Comment>
   @Query("select * from comment where created_by = :customer and about = :id")
    fun findCustomerCommentsByEquity(customer: Int, id: Long): List<Comment>
}