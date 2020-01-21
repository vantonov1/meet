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
        val ownedBy: Long?,
        val district: Byte?,
        val subway: String?,
        val street: String?,
        val building: String?,
        val lat: Double?,
        val lon:Double?,
        val price: Int,
        val square: Int?,
        val rooms: Byte?,
        val info: String?,
        val hidden: Boolean?
)

enum class EquityType {
        SALE_ROOM, SALE_FLAT, SALE_BUSINESS, RENT_ROOM, RENT_FLAT, RENT_BUSINESS
}

data class Photo(
        val id: String,
        val of: Long
)

data class Filter(val type: List<Int>,
                  val district: List<Byte>?,
                  val subway: List<String>?,
                  val priceMin: Int?,
                  val priceMax: Int?,
                  val minLat: Double? = null,
                  val minLon: Double? = null,
                  val maxLat: Double? = null,
                  val maxLon: Double? = null
)