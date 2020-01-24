package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Equity
import com.github.vantonov1.meet.entities.Photo
import com.github.vantonov1.meet.entities.PriceRange
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface EquityRepository : ReactiveCrudRepository<Equity, Long> {
    @Query("select * from equity where id=(:id) and hidden is null")
    override fun findById(id: Long): Mono<Equity>

    @Query("select * from equity where type in (:type) and city = :city and hidden is null " +
            "and price >= (:priceMin) and price <= (:priceMax)")
    fun find(type: List<Int>, city: Short, priceMin: Int, priceMax: Int): Flux<Equity>

    @Query("select * from equity where type in (:type) and city = :city and hidden is null " +
            "and price >= (:priceMin) and price <= (:priceMax) and district in (:district) and subway in (:subway)")
    fun findWithDistrictAndSubway(type: List<Int>,  city: Short, district: List<Short>, subway: List<String>, priceMin: Int, priceMax: Int): Flux<Equity>

    @Query("select * from equity where type in (:type) and city = :city and hidden is null " +
            "and price >= (:priceMin) and price <= (:priceMax) and subway in (:subway)")
    fun findWithSubway(type: List<Int>,  city: Short, subway: List<String>, priceMin: Int, priceMax: Int): Flux<Equity>

    @Query("select * from equity where type in (:type) and city = :city and hidden is null " +
            "and price >= (:priceMin) and price <= (:priceMax) and district in (:district)")
    fun findWithDistrict(type: List<Int>,  city: Short, district: List<Short>, priceMin: Int, priceMax: Int): Flux<Equity>

    @Query("update equity set hidden = true where id = :id")
    fun hide(id: Long): Mono<Void>

    @Query("update equity set hidden = null where id = :id")
    fun expose(id: Long): Mono<Void>
}

@Repository
interface EquityPriceRangeRepository : ReactiveCrudRepository<PriceRange, Long> {
    @Query("select min(price) as minPrice, max(price) as maxPrice from equity where type in (:type) and city = :city and hidden is null ")
    fun getPriceRange(type: List<Int>, city: Short): Mono<PriceRange>

    @Query("select min(price), max(price) from equity where type in (:type) and city = :city and hidden is null " +
            " and district in (:district) and subway in (:subway)")
    fun getPriceRangeWithDistrictAndSubway(type: List<Int>,  city: Short, district: List<Short>, subway: List<String>): Mono<PriceRange>

    @Query("select min(price), max(price) from equity where type in (:type) and city = :city and hidden is null " +
            " and subway in (:subway)")
    fun getPriceRangeWithSubway(type: List<Int>, city: Short, subway: List<String>): Mono<PriceRange>

    @Query("select min(price), max(price) from equity where type in (:type) and city = :city and hidden is null " +
            " and district in (:district)")
    fun getPriceRangeWithDistrict(type: List<Int>,  city: Short, district: List<Short>): Mono<PriceRange>
}

@Repository
interface PhotoRepository : ReactiveCrudRepository<Photo, String> {
    @Query("select * from photo where of=:of")
    fun findByOf(of: Long): Flux<Photo>
}
