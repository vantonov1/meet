package com.github.vantonov1.meet.entities

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table
data class Agent(
        @Id
        val id: Int? = null,
        val name: String,
        val employedBy: Short
)