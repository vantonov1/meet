package com.github.vantonov1.meet.dto

import com.github.vantonov1.meet.entities.Agent

data class AgentDTO(
        val id: Int? = null,
        val name: String,
        val contacts: List<ContactDTO>,
        val employedBy: Short
) {
    fun toEntity(): Agent = Agent(id, name, employedBy)
}

fun fromEntity(agent: Agent, contacts: List<ContactDTO>) = AgentDTO(agent.id!!, agent.name, contacts, agent.employedBy)