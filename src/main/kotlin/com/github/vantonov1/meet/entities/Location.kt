package com.github.vantonov1.meet.entities

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("equity")
data class Location(
        @Id
        val id: Long?,
        val lat: Double?,
        val lon: Double?
)