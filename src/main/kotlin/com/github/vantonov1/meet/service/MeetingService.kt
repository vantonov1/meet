package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.MeetingDTO
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.dto.msk
import com.github.vantonov1.meet.dto.toMSK
import com.github.vantonov1.meet.entities.Meeting
import com.github.vantonov1.meet.repository.MeetingRepository
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import org.springframework.web.server.ServerWebInputException
import java.time.ZonedDateTime

@Service
@DependsOn("liquibase")
class MeetingService(private val meetingRepository: MeetingRepository,
                     private val customerService: CustomerService,
                     private val agentService: AgentService,
                     private val equityService: EquityService
) {
    fun save(dto: MeetingDTO): Int {
        if (ZonedDateTime.parse(dto.schedule).isBefore(ZonedDateTime.now())) {
            throw ServerWebInputException("Встреча в прошлом")
        }
        return meetingRepository.save(dto.toEntity()).id!!
    }

    fun reschedule(id: Int, schedule: ZonedDateTime) {
        if (schedule.isBefore(ZonedDateTime.now())) {
            throw ServerWebInputException("Встреча в прошлом")
        }
        val meeting = meetingRepository.findById(id)
        if(meeting.isEmpty)
            throw  ServerWebInputException("Встреча не найдена")
        meetingRepository.save(meeting.get().copy(schedule = toMSK(schedule)))
    }

    fun delete(id: Int) = meetingRepository.deleteById(id)

    fun findByPersons(scheduledBy: Int?, attends: Int?, dateMin: ZonedDateTime, dateMax: ZonedDateTime) =
        if (scheduledBy != null) meetingRepository.findByScheduler(scheduledBy, toMSK(dateMin), toMSK(dateMax)).map { collectMeetingInfo(it) }
        else if (attends != null) meetingRepository.findByAttending(attends, toMSK(dateMin), toMSK(dateMax)).map { collectMeetingInfo(it) }
        else listOf()

    private fun collectMeetingInfo(meeting: Meeting) =
        if (meeting.at != null)
            fromEntity(meeting, equityService.findById(meeting.at), customerService.findById(meeting.attends), agentService.findById(meeting.scheduledBy))
        else
            fromEntity(meeting, null, customerService.findById(meeting.attends),agentService.findById(meeting.scheduledBy))

    fun findDateByRequest(id: Int): ZonedDateTime {
        val meetings = meetingRepository.findByRequest(id)
        return if(meetings.isEmpty()) ZonedDateTime.now().minusDays(1) else ZonedDateTime.of(meetings[0].schedule, msk)
    }
}