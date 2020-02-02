package com.github.vantonov1.meet.dto

import com.github.vantonov1.meet.entities.Meeting
import java.time.ZonedDateTime

data class MeetingDTO(
        val id: Int? = null,
        val at: EquityDTO?,
        val scheduledBy: AgentDTO,
        val attends: CustomerDTO,
        val schedule: ZonedDateTime,
        val comment: String?
) {
    fun toEntity() = Meeting(id, at?.id, scheduledBy.id!!, attends.id!!, schedule, comment)
}


fun fromEntity(meeting: Meeting, at: EquityDTO?, attends: CustomerDTO, scheduledBy: AgentDTO) =
        MeetingDTO(meeting.id, at, scheduledBy, attends, meeting.schedule, meeting.comment)