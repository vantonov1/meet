package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.MeetingTimeTableEntryDTO
import com.github.vantonov1.meet.dto.TimeSlotDTO
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.dto.fromMillis
import com.github.vantonov1.meet.entities.Meeting
import com.github.vantonov1.meet.entities.TimeSlot
import com.github.vantonov1.meet.repository.MeetingRepository
import com.github.vantonov1.meet.repository.TimeSlotRepository
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.LocalDateTime
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

@Service
@DependsOn("liquibase")
class TimeSlotService(private val repository: TimeSlotRepository, private val meetingRepository: MeetingRepository) {

    fun findTimeSlots(requestId: Int): Flux<TimeSlotDTO> {
        return repository.findByRequestId(requestId).map { fromEntity(it) }
    }

    fun create(requestId: Int, slots: List<TimeSlotDTO>) =
            repository.deleteAllByRequestId(requestId)
                    .then(repository.saveAll(slots.map { it.toEntity(requestId) }).collectList())
                    .then(Mono.empty<Void>())

    fun collectTimeTable(agentId: Int, buyerId: Int, sellerId: Int): Mono<List<MeetingTimeTableEntryDTO>> {
        val now = ZonedDateTime.now()
        return Mono.zip(
                repository.findByRequestId(buyerId).collectList(),
                repository.findByRequestId(sellerId).collectList(),
                meetingRepository.findByScheduler(agentId, now, now.plusDays(7)).collectList()
        ).flatMap { Mono.just(createTimeTable(it.t1, it.t2, it.t3)) }
    }

    private fun createTimeTable(buyerSlots: List<TimeSlot>, sellerSlots: List<TimeSlot>, agentMeetings: List<Meeting>): List<MeetingTimeTableEntryDTO> {
        val buyerTable = createPeopleTable(buyerSlots, listOf(null, null, true))
        val sellerTable = createPeopleTable(sellerSlots, listOf(null, true, null))
        val agentTable = createAgentTable(agentMeetings)
        val joined = mutableListOf<MeetingTimeTableEntryDTO>()
        listOf(agentTable, buyerTable, sellerTable)
                .flatten()
                .sortedWith(Comparator { a, b -> if (a.date == b.date) a.timeMin.compareTo(b.timeMin) else a.date.compareTo(b.date) })
                .forEach {
                    if (joined.isEmpty() || joined.last().date != it.date || joined.last().timeMax < it.timeMin)
                        joined.add(it)
                    else {
                        val last = joined.last()
                        joined.removeAt(joined.size - 1)
                        if (last.date == it.date && last.timeMin == it.timeMin && last.timeMax == it.timeMin) {
                            joined.add(MeetingTimeTableEntryDTO(it.date, last.timeMax, it.timeMax,
                                    last.agent ?: false || it.agent ?: false,
                                    last.seller ?: false || it.seller ?: false,
                                    last.buyer ?: false || it.buyer ?: false
                            ))
                        } else {
                            if (last.timeMin != it.timeMin)
                                joined.add(last.copy(timeMax = it.timeMin))
                            if (it.timeMax > last.timeMax) {
                                joined.add(MeetingTimeTableEntryDTO(last.date, it.timeMin, last.timeMax,
                                        last.agent ?: false || it.agent ?: false,
                                        last.seller ?: false || it.seller ?: false,
                                        last.buyer ?: false || it.buyer ?: false
                                ))
                                joined.add(it.copy(timeMin = last.timeMax))
                            } else {
                                joined.add(MeetingTimeTableEntryDTO(last.date, it.timeMin, it.timeMax,
                                        last.agent ?: false || it.agent ?: false,
                                        last.seller ?: false || it.seller ?: false,
                                        last.buyer ?: false || it.buyer ?: false
                                ))
                                joined.add(last.copy(timeMin = it.timeMax))
                            }
                        }
                    }
                }
        return joined
    }

    private fun createAgentTable(agentMeetings: List<Meeting>): List<MeetingTimeTableEntryDTO> {
        val now = ZonedDateTime.now()
        val hhmm: DateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm")
        return agentMeetings.map {
            MeetingTimeTableEntryDTO(
                    ((7 + it.schedule.dayOfWeek.value - now.dayOfWeek.value) % 7).toByte(),
                    it.schedule.format(hhmm),
                    it.schedule.plusMinutes(15).format(hhmm),
                    agent = false, seller = null, buyer = null
            )
        }
    }

    private fun createPeopleTable(slots: List<TimeSlot>, busy: List<Boolean?>): MutableList<MeetingTimeTableEntryDTO> {
        val today = LocalDateTime.now().dayOfWeek.value - 1
        val peopleTable = mutableListOf<MeetingTimeTableEntryDTO>()
        for (i in 0..6) {
            peopleTable.addAll(slots
                    .filter { it.dayOfWeek == i.toByte() }
                    .map { MeetingTimeTableEntryDTO(((7 + i - today) % 7).toByte(), fromMillis(it.minTime), fromMillis(it.maxTime), busy[0], busy[1], busy[2]) })
        }
        return peopleTable
    }
}