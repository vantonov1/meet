package com.github.vantonov1.meet.dto

import com.github.vantonov1.meet.entities.District
import com.github.vantonov1.meet.entities.Equity
import com.github.vantonov1.meet.entities.EquityType
import com.github.vantonov1.meet.entities.Subway

data class EquityDTO(
        val id: Long?,
        val type: String, //EquityType.name,
//        val ownedBy: Long?,
        val address: AddressDTO,
        val price: Int,
        val square: Int?,
        val rooms: Byte?,
        val info: String?,
        val photos: List<String>?
) {
    fun toEntity(): Equity {
        return Equity(id, EquityType.valueOf(type).ordinal.toByte(), 0,
                address.city, address.district?.id, address.subway?.id, address.street, address.building, address.lat, address.lon,
                price, square, rooms, info, null)
    }
}

fun fromEntity(equity: Equity, district: District?, subway: Subway?, photos: List<String>?) = EquityDTO(
        equity.id, EquityType.valueOf(equity.type).name,
        AddressDTO(equity.city, district, subway, equity.street, equity.building, equity.lat, equity.lon),
        equity.price, equity.square, equity.rooms, equity.info, photos
)
