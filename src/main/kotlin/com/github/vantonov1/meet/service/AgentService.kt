package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.AgentDTO
import com.github.vantonov1.meet.dto.CustomerDTO
import com.github.vantonov1.meet.dto.RequestDTO
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.entities.Agent
import com.github.vantonov1.meet.repository.AgentRepository
import com.github.vantonov1.meet.service.impl.InvitationSender
import com.github.vantonov1.meet.service.impl.invitation
import com.github.vantonov1.meet.service.impl.saveClaim
import com.github.vantonov1.meet.service.impl.tryGetAgentId
import org.springframework.context.annotation.DependsOn
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Service
import org.springframework.web.server.ServerWebInputException
import kotlin.random.Random

@Service
@DependsOn("liquibase")
class AgentService(val repository: AgentRepository, val contactService: ContactService, val invitationSender: InvitationSender) {

    fun invite(email: String, base: String): Agent {
        val a = repository.save(Agent(null, "", 0, false, invitation()))
        invitationSender.sendInviteByMail(email, base, a.invitation!!)
        return a
    }

    fun register(dto: AgentDTO, invitation: String, token: Authentication): AgentDTO {
        if (invitation.isEmpty())
            throw ServerWebInputException("Неизвестное приглашение")
        val invited = repository.findByInvitation(invitation)
        if (invited.isEmpty())
            throw ServerWebInputException("Неизвестное приглашение")
        val id = invited[0].id!!
        saveClaim(token, Pair("agent", id))
        val saved = repository.save(dto.toEntity().copy(id = id, active = true, invitation = ""))
        return fromEntity(saved, contactService.save(id, dto.contacts))
    }

    fun save(dto: AgentDTO): Int? {
        val agent = repository.save(dto.toEntity().copy(active = true))
        contactService.save(agent.id!!, dto.contacts)
        return agent.id
    }

    fun delete(id: Int) {
        repository.deleteById(id)
        contactService.deleteAll(id)
    }

    fun findAll(): List<AgentDTO> {
        val agents = repository.findAll()
        return if(agents.toList().isNotEmpty()) {
            val contacts = contactService.findAllByPersonId(agents.map { it.id!! })
            agents.map { agent -> fromEntity(agent, contacts[agent.id] ?: listOf()) }
        } else
            listOf()
    }

    fun findById(id: Int): AgentDTO {
        val agent = repository.findById(id)
        val contacts = contactService.findByPersonId(id)
        if (agent.isEmpty) throw ServerWebInputException("Агент не найден")
        return fromEntity(agent.get(), contacts)
    }

    fun selectAgent(dto: RequestDTO, customer: CustomerDTO): Int {
        val agentId = tryGetAgentId()
        if(agentId != null)
            return agentId //for debugging mainly
        val agents = repository
                .findActive(if (dto.about != null) dto.about.address.city else customer.city)
                .map { it.id!! }
        return if (agents.isNotEmpty()) agents[Random.nextInt(agents.size)] else throw IllegalStateException("Нет активных агентов")
    }

    fun setActive(id: Int, active: Boolean): Boolean {
        val it = repository.setActive(id, active)
        return if (it) it else throw ServerWebInputException("Агент не найден")
    }
}