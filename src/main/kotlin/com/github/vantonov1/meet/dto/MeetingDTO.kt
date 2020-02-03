package com.github.vantonov1.meet.dto

import com.github.vantonov1.meet.entities.Meeting
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

data class MeetingDTO(
        val id: Int? = null,
        val fromRequest: Int,
        val at: EquityDTO?,
        val scheduledBy: AgentDTO,
        val attends: CustomerDTO,
        val schedule: String,
        val comment: String?
) {
    fun toEntity() = Meeting(id, fromRequest, at?.id, scheduledBy.id!!, attends.id!!, ZonedDateTime.parse(schedule), comment)
}


fun fromEntity(meeting: Meeting, at: EquityDTO?, attends: CustomerDTO, scheduledBy: AgentDTO) =
        MeetingDTO(meeting.id, meeting.fromRequest, at, scheduledBy, attends, meeting.schedule.format(DateTimeFormatter.ISO_ZONED_DATE_TIME), meeting.comment)