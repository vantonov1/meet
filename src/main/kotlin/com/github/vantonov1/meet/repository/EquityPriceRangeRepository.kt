package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.PriceRange
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface EquityPriceRangeRepository : CrudRepository<PriceRange, Long> {
    @Query("select min(price) as minPrice, max(price) as maxPrice from equity where type in (:type) and city = :city and hidden is null ")
    fun getPriceRange(type: List<Byte>, city: Short): PriceRange

    @Query("select min(price), max(price) from equity where type in (:type) and city = :city and hidden is null " +
            " and district in (:district) and subway in (:subway)")
    fun getPriceRangeWithDistrictAndSubway(type: List<Byte>, city: Short, district: List<Short>, subway: List<String>): PriceRange

    @Query("select min(price), max(price) from equity where type in (:type) and city = :city and hidden is null " +
            " and subway in (:subway)")
    fun getPriceRangeWithSubway(type: List<Byte>, city: Short, subway: List<String>): PriceRange

    @Query("select min(price), max(price) from equity where type in (:type) and city = :city and hidden is null " +
            " and district in (:district)")
    fun getPriceRangeWithDistrict(type: List<Byte>, city: Short, district: List<Short>): PriceRange
}