package com.github.vantonov1.meet.dto

import com.github.vantonov1.meet.entities.Meeting
import java.time.LocalDateTime
import java.time.ZoneId
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
    fun toEntity() = Meeting(id, fromRequest, at?.id, scheduledBy.id!!, attends.id!!, toMSK(schedule), comment)

}


fun fromEntity(meeting: Meeting, at: EquityDTO?, attends: CustomerDTO, scheduledBy: AgentDTO) =
        MeetingDTO(meeting.id, meeting.fromRequest, at, scheduledBy, attends, fromMSK(meeting.schedule), meeting.comment)

val msk: ZoneId = ZoneId.of("UTC+03:00")
fun toMSK(schedule: String): LocalDateTime = toMSK(ZonedDateTime.parse(schedule))
fun toMSK(schedule: ZonedDateTime): LocalDateTime = LocalDateTime.ofInstant(schedule.toInstant(), msk)
fun fromMSK(schedule: LocalDateTime): String = ZonedDateTime.of(schedule, msk).format(DateTimeFormatter.ISO_ZONED_DATE_TIME)
