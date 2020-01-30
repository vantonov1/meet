package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.MeetingDTO
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.entities.Meeting
import com.github.vantonov1.meet.repository.MeetingRepository
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.ZonedDateTime

@Service
@DependsOn("liquibase")
class MeetingService(private val meetingRepository: MeetingRepository,
                     private val customerService: CustomerService,
                     private val agentService: AgentService,
                     private val equityService: EquityService
) {
    fun save(dto: MeetingDTO): Mono<Int> {
        return meetingRepository.save(dto.toEntity()).map { it.id }
    }

    fun reschedule(id: Int, schedule: ZonedDateTime): Mono<Any> {
        return meetingRepository.findById(id).flatMap { meetingRepository.save(it.copy(schedule = schedule)).map {it.id} }
    }

    fun delete(id: Int) = meetingRepository.deleteById(id)

    fun findByPersons(scheduledBy: Int?, attends: Int?, dateMin: ZonedDateTime, dateMax: ZonedDateTime): Flux<MeetingDTO> {
        return when {
            scheduledBy != null -> meetingRepository.findByScheduler(scheduledBy, dateMin, dateMax).flatMap { collectMeetingInfo(it) }
            attends != null -> meetingRepository.findByAttending(attends, dateMin, dateMax).flatMap { collectMeetingInfo(it) }
            else -> Flux.empty()
        }
    }

    private fun collectMeetingInfo(meeting: Meeting) =
            if (meeting.at != null)
                Mono.zip(
                        equityService.findById(meeting.at),
                        customerService.findById(meeting.attends),
                        agentService.findById(meeting.scheduledBy)
                ).map { fromEntity(meeting, it.t1, it.t2, it.t3) }
            else
                Mono.zip(
                        customerService.findById(meeting.attends),
                        agentService.findById(meeting.scheduledBy)
                ).map { fromEntity(meeting, null, it.t1, it.t2) }
}