package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.TimeSlotDTO
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.repository.TimeSlotRepository
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
@DependsOn("liquibase")
class TimeSlotService(private val repository: TimeSlotRepository) {

    fun findTimeSlots(requestId: Int): Flux<TimeSlotDTO> {
        return repository.findByRequestId(requestId).map { fromEntity(it) }
    }

    fun create(requestId: Int, slots: List<TimeSlotDTO>) =
            repository.deleteAllByRequestId(requestId)
                    .then(repository.saveAll(slots.map { it.toEntity(requestId) }).collectList())
                    .then(Mono.empty<Void>())
}