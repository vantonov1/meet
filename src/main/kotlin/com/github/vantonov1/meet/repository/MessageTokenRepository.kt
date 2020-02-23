package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.MessageToken
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Mono

interface MessageTokenRepository: ReactiveCrudRepository<MessageToken, Int> {
    @Query("insert into message_token values(:personId, :token)")
    fun insert(personId: Int, token: String) : Mono<Void>
}