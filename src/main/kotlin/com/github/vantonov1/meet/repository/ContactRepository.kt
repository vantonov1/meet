package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Contact
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface ContactRepository : ReactiveCrudRepository<Contact, Int> {
    @Query("select * from contact where of=:of")
    fun findByOf(of: Int): Flux<Contact>

    @Query("select * from contact where of in (:of)")
    fun findAllByOf(of: List<Int>): Flux<Contact>

    @Query("delete from contact where of=:of")
    fun deleteAllByPersonId(of: Int): Mono<Void>
}