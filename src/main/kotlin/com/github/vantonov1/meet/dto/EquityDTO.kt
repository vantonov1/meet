package com.github.vantonov1.meet.dto

import com.github.vantonov1.meet.entities.Equity

data class EquityDTO(
        val equity: Equity,
        val district: String?,
        val subway: String?,
        val photos: List<String>?
)