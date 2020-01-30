package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Agent
import org.springframework.data.r2dbc.repository.Modifying
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface AgentRepository : ReactiveCrudRepository<Agent, Int> {
    @Modifying
    @Query("update agent set active=:active where id=:id")
    fun setActive(id: Int, active: Boolean): Mono<Boolean>

    @Query("select * from agent where city=:city and active=true")
    fun findActive(city: Short): Flux<Agent>
}