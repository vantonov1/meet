package com.github.vantonov1.meet.controller.auth

import com.github.vantonov1.meet.dto.MeetingDTO
import com.github.vantonov1.meet.service.MeetingService
import com.github.vantonov1.meet.service.impl.getAgentId
import org.springframework.security.access.annotation.Secured
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import java.time.ZonedDateTime

@RestController
@RequestMapping("/api/auth/v1/meeting")
@CrossOrigin("*")
@Suppress("unused")
class MeetingController(private val meetingService: MeetingService) {
    @PostMapping
    @Transactional
    @Secured("ROLE_AGENT")
    fun create(@RequestBody dto: MeetingDTO) = meetingService.save(dto)

    @PutMapping("/{id}")
    @Transactional
    @Secured("ROLE_AGENT")
    fun reschedule(@PathVariable id: Int, @RequestParam schedule: String) = meetingService.reschedule(id, ZonedDateTime.parse(schedule))

    @DeleteMapping("/{id}")
    @Transactional
    @Secured("ROLE_AGENT")
    fun delete(@PathVariable id: Int) = meetingService.delete(id)

    @GetMapping
    @Transactional(readOnly = true)
    fun findByPersons(@RequestParam(required = false) scheduledBy: Int?,
                      @RequestParam(required = false) attends: Int?,
                      @RequestParam dateMin: String,
                      @RequestParam dateMax: String
    ) = meetingService.findByPersons(getAgentId(), attends, ZonedDateTime.parse(dateMin), ZonedDateTime.parse(dateMax))
}