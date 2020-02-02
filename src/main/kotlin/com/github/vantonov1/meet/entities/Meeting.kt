package com.github.vantonov1.meet.entities

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.ZonedDateTime

@Table
data class Meeting(
        @Id
        val id: Int? = null,
        val at: Long?,
        val scheduledBy: Int,
        val attends: Int,
        val schedule: ZonedDateTime,
        val comment: String?
)