package com.github.vantonov1.meet.dto

import com.github.vantonov1.meet.entities.District
import com.github.vantonov1.meet.entities.Equity
import com.github.vantonov1.meet.entities.Subway

data class EquityDTO(
        val id: Long?,
        val type: Byte, //EquityType,
//        val ownedBy: Long?,
        val district: District?,
        val subway: Subway?,
        val street: String?,
        val building: String?,
        val lat: Double?,
        val lon: Double?,
        val price: Int,
        val square: Int?,
        val rooms: Byte?,
        val info: String?,
        val photos: List<String>?
) {
    fun toEntity(): Equity {
        return Equity(id, type,  0, district?.id, subway?.id, street, building, lat, lon, price, square, rooms, info, null)
    }
}

fun fromEntity(equity: Equity, district: District?, subway: Subway?, photos: List<String>?) = EquityDTO(
        equity.id, equity.type, district, subway, equity.street, equity.building, equity.lat, equity.lon, equity.price, equity.square, equity.rooms, equity.info, photos
)
