package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.TimeSlot
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface TimeSlotRepository :  ReactiveCrudRepository<TimeSlot, Int> {
    @Query("select * from time_slot where for_request=:requestId")
    fun findByRequestId(requestId: Int): Flux<TimeSlot>

    @Query("delete from time_slot where for_request=:requestId")
    fun deleteAllByRequestId(requestId: Int): Mono<Void>
}