package com.github.vantonov1.meet.entities

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table
data class Comment(
        @Id val id: Int? = null,
        val createdBy: Int,
        val about: Long,
        val rate:Byte,
        val text: String,
        val shared: Boolean
)