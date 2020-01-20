package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.District
import com.github.vantonov1.meet.entities.Equity
import com.github.vantonov1.meet.entities.Photo
import com.github.vantonov1.meet.entities.Subway
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface EquityRepository : ReactiveCrudRepository<Equity, Long> {
    @Query("select * from equity where id=(:id) and hidden is null")
    override fun findById(id: Long): Mono<Equity>

    @Query("select * from equity where type in (:type) and hidden is null " +
            "and price >= (:priceMin) and price <= (:priceMax)")
    fun find(type: List<Int>, priceMin: Int, priceMax: Int): Flux<Equity>
    @Query("select * from equity where type in (:type) and hidden is null " +
            "and price >= (:priceMin) and price <= (:priceMax) and district in (:district) and subway in (:subway)")
    fun findWithDistrictAndSubway(type: List<Int>, district: List<Byte>, subway: List<Short>, priceMin: Int, priceMax: Int): Flux<Equity>
    @Query("select * from equity where type in (:type) and hidden is null " +
            "and price >= (:priceMin) and price <= (:priceMax) and subway in (:subway)")
    fun findWithSubway(type: List<Int>, subway: List<Short>, priceMin: Int, priceMax: Int): Flux<Equity>
    @Query("select * from equity where type in (:type) and hidden is null " +
            "and price >= (:priceMin) and price <= (:priceMax) and district in (:district)")
    fun findWithDistrict(type: List<Int>, district: List<Byte>, priceMin: Int, priceMax: Int): Flux<Equity>
    @Query("select id, type, lat, lon from equity where type in (:type) and hidden is null " +
            "and district in (:district) and subway in (:subway) and price >= (:priceMin) and price <= (:priceMax) " +
            "and lat >= (:minLat) and lon >= (:minLon) and lat < (:maxLat) and lon < (:maxLon)")
    fun findByLocation(type: List<Int>, district: List<Byte>, subway: List<Short>, priceMin: Int, priceMax: Int,
                       minLat: Double, minLon: Double, maxLat: Double, maxLon: Double): Flux<Equity>
    @Query("update equity set hidden = true where id = :id")
    fun hide(id: Long): Mono<Void>
    @Query("update equity set hidden = null where id = :id")
    fun expose(id: Long): Mono<Void>
}

@Repository
interface PhotoRepository : ReactiveCrudRepository<Photo, String> {
    @Query("select * from photo where of=:of")
    fun findByOf(of: Long): Flux<Photo>
}

@Repository
interface DistrictsRepository : ReactiveCrudRepository<District, Byte> {
    @Query("select * from district where name = :name")
    fun findByName(name: String): Mono<District>

    @Query("select * from district where city = :city")
    fun findByCity(city: Short): Flux<District>
}

@Repository
interface SubwayRepository : ReactiveCrudRepository<Subway, Short>
