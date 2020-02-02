package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Request
import org.springframework.data.r2dbc.repository.Modifying
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface RequestRepository : ReactiveCrudRepository<Request, Int> {
    @Query("select * from request where issued_by=:issuedBy")
    fun findByIssuer(issuedBy: Int): Flux<Request>
    @Query("select * from request where assigned_to=:assignedTo")
    fun findByAssignee(assignedTo: Int): Flux<Request>

    @Modifying
    @Query("update request set about=:equityId where id=:id")
    fun attachEquity(equityId: Long, id: Int): Mono<Boolean>
}