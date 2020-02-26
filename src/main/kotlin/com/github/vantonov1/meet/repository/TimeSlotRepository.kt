package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.TimeSlot
import org.springframework.data.jdbc.repository.query.Modifying
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface TimeSlotRepository : CrudRepository<TimeSlot, Int> {
    @Query("select * from time_slot where for_request=:requestId order by day_of_week, min_time")
    fun findByRequestId(requestId: Int): List<TimeSlot>

    @Modifying
    @Query("delete from time_slot where for_request=:requestId")
    fun deleteAllByRequestId(requestId: Int): Int
}