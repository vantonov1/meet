package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Admin
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux

interface AdminRepository : ReactiveCrudRepository<Admin, Short> {
    @Query("select * from admin where email=:email")
    fun findByEmail(email: String) : Flux<Admin>

    @Query("select * from admin where invitation=:invitation")
    fun findByInvitation(invitation: String) : Flux<Admin>
}