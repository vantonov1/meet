package com.github.vantonov1.meet.entities

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table
data class Admin(
        @Id
        val id: Short? = null,
        val invitation: String,
        val email: String
)