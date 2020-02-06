package com.github.vantonov1.meet.entities

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table
data class TimeSlot(@Id val id: Int? = null, val for_request: Int, val dayOfWeek: Byte, val minTime: Int, val maxTime: Int)