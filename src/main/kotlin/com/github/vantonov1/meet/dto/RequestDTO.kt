package com.github.vantonov1.meet.dto

import com.github.vantonov1.meet.entities.Request
import com.github.vantonov1.meet.entities.RequestType
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

data class RequestDTO(
        val id: Int? =null,
        val type: String, //RequestType
        val about: EquityDTO?,
        val issuedBy: CustomerDTO,
        val assignedTo: AgentDTO?,
        val meetingScheduled: String?,
        val comments: List<CommentDTO>?
){
    fun toEntity(issuedBy: Int, assignedTo: Int) = Request(id, RequestType.valueOf(type).value, about?.id, issuedBy , assignedTo)
}

fun fromEntity(request: Request, about: EquityDTO?, issuedBy: CustomerDTO, assignedTo: AgentDTO?, meeting: ZonedDateTime?, comments: List<CommentDTO>) =
        RequestDTO(request.id, RequestType.valueOf(request.type).name, about, issuedBy, assignedTo, meeting?.format(DateTimeFormatter.ISO_ZONED_DATE_TIME), comments )