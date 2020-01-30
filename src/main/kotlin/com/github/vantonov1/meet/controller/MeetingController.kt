package com.github.vantonov1.meet.controller

import com.github.vantonov1.meet.dto.MeetingDTO
import com.github.vantonov1.meet.service.MeetingService
import org.springframework.http.HttpStatus
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import java.time.ZonedDateTime

@RestController
@RequestMapping("/api/v1/meeting")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class MeetingController(private val meetingService: MeetingService) {
    @PostMapping
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody dto: MeetingDTO) = meetingService.save(dto)

    @PutMapping("/{id}")
    @Transactional
    fun reschedule(@PathVariable id: Int, @RequestParam schedule: ZonedDateTime) = meetingService.reschedule(id, schedule)

    @DeleteMapping("/{id}")
    @Transactional
    fun delete(id: Int) = meetingService.delete(id)

    @GetMapping
    @Transactional(readOnly = true)
    fun findByPersons(@RequestParam(required = false) scheduledBy: Int?,
                      @RequestParam(required = false) attends: Int?,
                      @RequestParam dateMin: ZonedDateTime,
                      @RequestParam dateMax: ZonedDateTime
    ) = meetingService.findByPersons(scheduledBy, attends, dateMin, dateMax)
}