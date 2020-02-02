package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.AgentDTO
import com.github.vantonov1.meet.dto.RequestDTO
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.repository.AgentRepository
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import kotlin.random.Random

@Service
@DependsOn("liquibase")
class AgentService(val repository: AgentRepository, val contactService: ContactService) {
    fun save(dto: AgentDTO) = repository.save(dto.toEntity().copy(active = true))
            .map { it.id!! }
            .flatMap { contactService.save(it, dto.contacts) }

    fun delete(id: Int) = repository.deleteById(id).flatMap { contactService.deleteAll(id) }
    fun findById(id: Int) = Mono.zip(repository.findById(id), contactService.findByPersonId(id))
            .map { fromEntity(it.t1, it.t2.map {c -> fromEntity(c) }) }

    fun selectAgent(dto: RequestDTO): Mono<Int> {
        return repository
                .findActive(if(dto.about != null) dto.about.address.city else dto.issuedBy.city)
                .map { it.id!! }
                .collectList()
                .map {if(it.isNotEmpty()) it[Random.nextInt(it.size)] else throw IllegalStateException("Нет активных агентов")}
    }

    fun setActive(id: Int, active: Boolean): Mono<Any> {
        return repository.setActive(id, active).map { if(it) Any() else throw IllegalArgumentException("Агент не найден") }
    }
}