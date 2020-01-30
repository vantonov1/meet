package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Meeting
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import java.time.ZonedDateTime

@Repository
interface MeetingRepository : ReactiveCrudRepository<Meeting, Int> {
    @Query("select * from meeting where attends=:attends and schedule between :dateMin and :dateMax")
    fun findByAttending(attends: Int, dateMin: ZonedDateTime, dateMax: ZonedDateTime): Flux<Meeting>
    @Query("select * from meeting where scheduled_by=:scheduledBy and schedule between :dateMin and :dateMax")
    fun findByScheduler(scheduledBy: Int, dateMin: ZonedDateTime, dateMax: ZonedDateTime): Flux<Meeting>
}