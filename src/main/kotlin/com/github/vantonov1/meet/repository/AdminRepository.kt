package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Admin
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository

interface AdminRepository : CrudRepository<Admin, Short> {
    @Query("select * from admin where email=:email")
    fun findByEmail(email: String) : List<Admin>

    @Query("select * from admin where invitation=:invitation")
    fun findByInvitation(invitation: String) : List<Admin>
}