package com.github.vantonov1.meet.dto

import com.github.vantonov1.meet.entities.District
import com.github.vantonov1.meet.entities.Subway

data class AddressDTO (
        val city: Short,
        val district: District?,
        val subway: Subway?,
        val street: String?,
        val building: String?,
        val lat: Double?,
        val lon: Double?
)
