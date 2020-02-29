package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.*
import com.github.vantonov1.meet.entities.Meeting
import com.github.vantonov1.meet.entities.TimeSlot
import com.github.vantonov1.meet.repository.MeetingRepository
import com.github.vantonov1.meet.repository.TimeSlotRepository
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

@Service
@DependsOn("liquibase")
class TimeSlotService(private val repository: TimeSlotRepository, private val meetingRepository: MeetingRepository) {

    fun findTimeSlots(requestId: Int): List<TimeSlotDTO> {
        return repository.findByRequestId(requestId).map { fromEntity(it) }
    }

    fun create(requestId: Int, slots: List<TimeSlotDTO>) {
        repository.deleteAllByRequestId(requestId)
        repository.saveAll(slots.map { it.toEntity(requestId) })
    }

    fun collectTimeTable(agentId: Int, buyerId: Int, sellerId: Int): List<MeetingTimeTableEntryDTO> {
        val now = ZonedDateTime.now()
        return createTimeTable(
                repository.findByRequestId(buyerId),
                repository.findByRequestId(sellerId),
                meetingRepository.findByScheduler(agentId, toMSK(now), toMSK(now.plusDays(7)))
        )
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
                    if (joined.isEmpty() || joined.last().date != it.date || joined.last().timeMax <= it.timeMin)
                        joined.add(it)//no intersection
                    else {
                        val last = joined.last()
                        joined.removeAt(joined.size - 1)
                        if (last.timeMin == it.timeMin && last.timeMax == it.timeMax)
                            joined.add(joinEntries(it, last, it.timeMax))// same time, just merge
                        else {
                            if (last.timeMin != it.timeMin)
                                joined.add(last.copy(timeMax = it.timeMin))//last part before
                            if (last.timeMax < it.timeMax) {
                                joined.add(joinEntries(it, last, last.timeMax))//intersection part
                                joined.add(it.copy(timeMin = last.timeMax))//new part after
                            } else {
                                joined.add(joinEntries(it, last, it.timeMax))//intersection part
                                if (last.timeMax != it.timeMax)
                                    joined.add(last.copy(timeMin = it.timeMax))//last part after
                            }
                        }
                    }
                }
        return joined
    }

    private fun joinEntries(it: MeetingTimeTableEntryDTO, last: MeetingTimeTableEntryDTO, timeMax: String): MeetingTimeTableEntryDTO {
        return MeetingTimeTableEntryDTO(it.date, it.timeMin, timeMax,
                if (last.agent != null || it.agent != null) false else null,
                last.seller ?: false || it.seller ?: false,
                last.buyer ?: false || it.buyer ?: false
        )
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