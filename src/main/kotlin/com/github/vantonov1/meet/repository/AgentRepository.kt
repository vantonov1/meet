package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Agent
import org.springframework.data.jdbc.repository.query.Modifying
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface AgentRepository : CrudRepository<Agent, Int> {
    @Modifying
    @Query("update agent set active=:active where id=:id")
    fun setActive(id: Int, active: Boolean): Boolean

    @Query("select * from agent where city=:city and active=true")
    fun findActive(city: Short): List<Agent>

    @Query("select * from agent where invitation=:invitation")
    fun findByInvitation(invitation: String): List<Agent>
}