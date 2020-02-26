package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Meeting
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface MeetingRepository : CrudRepository<Meeting, Int> {
    @Query("select * from meeting where attends=:attends and schedule between :dateMin and :dateMax order by schedule asc")
    fun findByAttending(attends: Int, dateMin: LocalDateTime, dateMax: LocalDateTime): List<Meeting>
    @Query("select * from meeting where scheduled_by=:scheduledBy and schedule between :dateMin and :dateMax order by schedule asc")
    fun findByScheduler(scheduledBy: Int, dateMin: LocalDateTime, dateMax: LocalDateTime): List<Meeting>
    @Query("select * from meeting where from_request=:requestId order by schedule asc")
    fun findByRequest(requestId: Int): List<Meeting>
}