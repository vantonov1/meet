package com.github.vantonov1.meet.entities

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table
data class Subway(@Id val id: Short? = null, val name: String, val city: Short, val color: String?)