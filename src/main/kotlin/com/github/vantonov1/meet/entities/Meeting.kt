package com.github.vantonov1.meet.entities

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table
data class Meeting(
        @Id
        val id: Int? = null,
        val fromRequest: Int,
        val at: Long?,
        val scheduledBy: Int,
        val attends: Int,
        val schedule: LocalDateTime,
        val comment: String?,
        val acknowledgedBySeller: Boolean?,
        val acknowledgedByBuyer: Boolean?
)