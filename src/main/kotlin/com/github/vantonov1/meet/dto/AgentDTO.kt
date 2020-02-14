package com.github.vantonov1.meet.dto

import com.github.vantonov1.meet.entities.Agent

data class AgentDTO(
        val id: Int? = null,
        val name: String,
        val contacts: List<ContactDTO>,
        val city: Short
) {
    fun toEntity() = Agent(id, name, city, false, null)
}

fun fromEntity(agent: Agent, contacts: List<ContactDTO>) = AgentDTO(agent.id!!, agent.name, contacts, agent.city)