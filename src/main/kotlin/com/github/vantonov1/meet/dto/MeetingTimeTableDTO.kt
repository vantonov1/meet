package com.github.vantonov1.meet.dto

data class MeetingTimeTableEntryDTO(
        val date: Byte, //0 is today
        val timeMin: String,
        val timeMax: String,
        val agent: Boolean?,
        val seller: Boolean?,
        val buyer: Boolean?
)