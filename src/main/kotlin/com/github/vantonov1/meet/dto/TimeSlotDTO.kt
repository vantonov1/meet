package com.github.vantonov1.meet.dto

import com.github.vantonov1.meet.entities.TimeSlot

val DAYS_OF_WEEK = listOf("пн", "вт", "ср", "чт", "пт", "сб", "вс")

data class TimeSlotDTO(val dayOfWeek: String, val minTime: String, val maxTime: String) {
    fun toEntity(requestId: Int) = TimeSlot(null, requestId, DAYS_OF_WEEK.indexOf(dayOfWeek).toByte(), toMillis(minTime), toMillis(maxTime))
}

fun fromEntity(t: TimeSlot) = TimeSlotDTO(DAYS_OF_WEEK[t.dayOfWeek.toInt()], fromMillis(t.minTime), fromMillis(t.maxTime))

fun fromMillis(time: Int): String {
    val HH = time / 1000 / 60
    val mm = time / 1000 % 60
    return "%02d:%02d".format(HH, mm)
}

fun toMillis(time: String) : Int {
    val (HH, mm) = time.split(":")
    return (HH.toInt() * 60 + mm.toInt()) * 1000
}