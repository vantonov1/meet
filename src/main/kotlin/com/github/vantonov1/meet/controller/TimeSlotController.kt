package com.github.vantonov1.meet.controller

import com.github.vantonov1.meet.dto.TimeSlotDTO
import com.github.vantonov1.meet.service.TimeSlotService
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/v1/timeslots")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class TimeSlotController (val service: TimeSlotService) {
    @PostMapping
    @Transactional
    fun create(@RequestParam requestId: Int, @RequestBody slots: List<TimeSlotDTO>) = service.create(requestId, slots)

    @GetMapping()
    @Transactional(readOnly = true)
    fun loadTimeSlots(@RequestParam requestId: Int) = service.findTimeSlots(requestId)

    @GetMapping("/table")
    @Transactional(readOnly = true)
    fun collectTimeTable(
            @RequestParam agentId: Int,
            @RequestParam buyerId: Int,
            @RequestParam sellerId: Int
    ) = service.collectTimeTable(agentId, buyerId, sellerId)
}