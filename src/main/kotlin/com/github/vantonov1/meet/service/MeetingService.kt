package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.*
import com.github.vantonov1.meet.entities.Meeting
import com.github.vantonov1.meet.repository.MeetingRepository
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import org.springframework.web.server.ServerWebInputException
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

@Service
@DependsOn("liquibase")
class MeetingService(private val meetingRepository: MeetingRepository,
                     private val customerService: CustomerService,
                     private val agentService: AgentService,
                     private val equityService: EquityService,
                     private val messagingService: MessagingService
) {
    fun save(dto: MeetingDTO): Int {
        if (ZonedDateTime.parse(dto.schedule).isBefore(ZonedDateTime.now())) {
            throw ServerWebInputException("Встреча в прошлом")
        }
        val id = meetingRepository.save(dto.toEntity()).id!!
        messagingService.sendMessage(dto.attends.id!!, "Назначен просмотр", address(dto.at) + '\n' + time(dto.schedule), "my-meetings")
        return id
    }

    private val dateTimeFormatter = DateTimeFormatter.ofPattern("dd.MM.yy HH:ss")

    private fun time(time: String) = ZonedDateTime.parse(time).format(dateTimeFormatter)

    private fun address(dto: EquityDTO?) = dto?.address?.street ?: "" + dto?.address?.building ?: ""

    fun reschedule(id: Int, schedule: ZonedDateTime) {
        if (schedule.isBefore(ZonedDateTime.now())) {
            throw ServerWebInputException("Просмотр в прошлом")
        }
        meetingRepository.save(findById(id).copy(schedule = toMSK(schedule)))
    }

    fun acknowledge(id: Int, customer: Int) {
        val meeting = findById(id)
        val equity = equityService.findById(meeting.at!!)
        when {
            meeting.attends == customer -> meetingRepository.save(meeting.copy(acknowledgedByBuyer = true))
            equity.ownedBy == customer -> meetingRepository.save(meeting.copy(acknowledgedBySeller = true))
            else -> throw ServerWebInputException("Ошибочный участник")
        }
        messagingService.sendMessage(meeting.scheduledBy, "Просмотр подтверждён", address(equity) + '\n' + meeting.schedule.format(dateTimeFormatter), "assigned-meetings")
    }

    private fun findById(id: Int): Meeting {
        val meeting = meetingRepository.findById(id)
        if (meeting.isEmpty)
            throw  ServerWebInputException("Просмотр не найден")
        val m = meeting.get()
        return m
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
                fromEntity(meeting, null, customerService.findById(meeting.attends), agentService.findById(meeting.scheduledBy))

    fun findDateByRequest(id: Int): ZonedDateTime {
        val meetings = meetingRepository.findByRequest(id)
        return if (meetings.isEmpty()) ZonedDateTime.now().minusDays(1) else ZonedDateTime.of(meetings[0].schedule, msk)
    }
}