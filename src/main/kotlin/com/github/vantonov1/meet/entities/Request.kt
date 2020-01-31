package com.github.vantonov1.meet.entities

import org.springframework.data.annotation.Id
import org.springframework.data.domain.Persistable
import org.springframework.data.relational.core.mapping.Table

enum class RequestType(val value: Byte) {
    BUY(1), SELL(2);

    companion object {
        fun valueOf(value: Byte) = values().first { it.value == value }
    }
}

@Table
data class Request(
        @Id
        private val id: Int? = null,
        val type: Byte, //RequestType
        val about: Long?,
        val issuedBy: Int,
        val assignedTo: Int
): Persistable<Int> {
    override fun isNew() = true //no request updates
    override fun getId() = id
}