package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.AgentDTO
import com.github.vantonov1.meet.dto.CustomerDTO
import com.github.vantonov1.meet.dto.RequestDTO
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.entities.Agent
import com.github.vantonov1.meet.entities.Contact
import com.github.vantonov1.meet.repository.AgentRepository
import com.github.vantonov1.meet.service.impl.invitation
import com.github.vantonov1.meet.service.impl.saveClaim
import org.springframework.context.annotation.DependsOn
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import kotlin.random.Random

@Service
@DependsOn("liquibase")
class AgentService(val repository: AgentRepository, val contactService: ContactService) {

    fun invite() = repository.save(Agent(null, "", 0, false, invitation()))

    fun register(dto: AgentDTO, invitation: String, token: Authentication) =
            if (invitation.isEmpty())
                Mono.error(IllegalArgumentException("Неизвестное приглашение"))
            else
                repository.findByInvitation(invitation).collectList().flatMap { invited ->
                    if (invited.isNotEmpty()) {
                        val id = invited[0].id!!
                        saveClaim(token, Pair("agent", id))
                                .then(repository.save(dto.toEntity().copy(id = id, active = true, invitation = "")))
                                .flatMap { contactService.save(id, dto.contacts) }
                    } else
                        Mono.error(IllegalArgumentException("Неизвестное приглашение"))
                }

    fun save(dto: AgentDTO) = repository.save(dto.toEntity().copy(active = true))
            .map { it.id!! }
            .flatMap { contactService.save(it, dto.contacts) }

    fun delete(id: Int) = repository.deleteById(id).flatMap { contactService.deleteAll(id) }

    fun findAll() = repository.findAll().collectList()
            .flatMap { agents -> Mono.zip(Mono.just(agents), contactService.findAllByPersonId(agents.map { it.id!! })) }
            .map {it.t1.map {agent ->
                val contacts: Collection<Contact> = it.t2[agent.id] ?: listOf()
                fromEntity(agent, contacts.map { fromEntity(it) })
            }}

    fun findById(id: Int) = Mono.zip(repository.findById(id), contactService.findByPersonId(id))
            .map { fromEntity(it.t1, it.t2.map { c -> fromEntity(c) }) }

    fun selectAgent(dto: RequestDTO, customer: CustomerDTO): Mono<Int> {
        return repository
                .findActive(if (dto.about != null) dto.about.address.city else customer.city)
                .map { it.id!! }
                .collectList()
                .map { if (it.isNotEmpty()) it[Random.nextInt(it.size)] else throw IllegalStateException("Нет активных агентов") }
    }

    fun setActive(id: Int, active: Boolean): Mono<Any> {
        return repository.setActive(id, active).map { if (it) Any() else throw IllegalArgumentException("Агент не найден") }
    }
}