package com.github.vantonov1.meet.entities

import org.springframework.data.annotation.Id
import org.springframework.data.domain.Persistable
import org.springframework.data.relational.core.mapping.Table

@Table
data class Photo(
        @Id
        private val id: String,
        val of: Long
) : Persistable<String> {
    override fun isNew() = true //no photo updates
    override fun getId() = id
}