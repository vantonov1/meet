package com.github.vantonov1.meet.entities

import com.fasterxml.jackson.annotation.JsonInclude
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table
@JsonInclude(JsonInclude.Include.NON_NULL)
data class Equity(
        @Id
        val id: Long?,
        val type: Byte, //EquityType,
        val ownedBy: Int?,
        val city: Short,
        val district: Short?,
        val subway: String?,
        val street: String?,
        val building: String?,
        val lat: Double?,
        val lon: Double?,
        val price: Int,
        val square: Int?,
        val rooms: Byte?,
        val info: String?,
        val responsible: Int?,
        val hidden: Boolean?
)

enum class EquityType(val value: Byte) {
    SALE_ROOM(1), SALE_FLAT(2), SALE_BUSINESS(4), RENT_ROOM(8), RENT_FLAT(16), RENT_BUSINESS(32), SALE_HOUSE(64);

    companion object {
        fun valueOf(value: Byte): EquityType = values().first { it.value == value }
    }
}

data class Filter(val type: List<Byte>,
                  val city: Short,
                  val district: List<Short>?,
                  val subway: List<String>?,
                  val priceMin: Int?,
                  val priceMax: Int?,
                  val minLat: Double? = null,
                  val minLon: Double? = null,
                  val maxLat: Double? = null,
                  val maxLon: Double? = null
)