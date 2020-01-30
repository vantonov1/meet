package com.github.vantonov1.meet.dto

import com.github.vantonov1.meet.entities.Request

data class RequestDTO(
        val id: Int? =null,
        val type: Byte, //RequestType
        val about: EquityDTO?,
        val issuedBy: CustomerDTO,
        val assignedTo: AgentDTO?
){
    fun toEntity(issuedBy: Int, assignedTo: Int) = Request(id, type, about?.id, issuedBy , assignedTo)
}

fun fromEntity(request: Request, about: EquityDTO?, issuedBy: CustomerDTO, assignedTo: AgentDTO?) =
        RequestDTO(request.id, request.type, about, issuedBy, assignedTo)