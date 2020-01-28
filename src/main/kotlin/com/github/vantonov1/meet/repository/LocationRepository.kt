package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Location
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface LocationRepository : ReactiveCrudRepository<Location, Long> {

    @Query("select id, lat, lon from equity where type in (:type) and city = :city and hidden is null " +
            "and price >= (:priceMin) and price <= (:priceMax) " +
            "order by price")
    fun find(type: List<Byte>, city: Short, priceMin: Int, priceMax: Int): Flux<Location>

    @Query("select id, lat, lon from equity where type in (:type) and city = :city and hidden is null " +
            "and price >= (:priceMin) and price <= (:priceMax) and district in (:district) and subway in (:subway) " +
            "order by price")
    fun findWithDistrictAndSubway(type: List<Byte>, city: Short, district: List<Short>, subway: List<String>, priceMin: Int, priceMax: Int): Flux<Location>

    @Query("select id, lat, lon from equity where type in (:type) and city = :city and hidden is null " +
            "and price >= (:priceMin) and price <= (:priceMax) and subway in (:subway)" +
            " order by price")
    fun findWithSubway(type: List<Byte>, city: Short, subway: List<String>, priceMin: Int, priceMax: Int): Flux<Location>

    @Query("select id, lat, lon from equity where type in (:type) and city = :city and hidden is null " +
            "and price >= (:priceMin) and price <= (:priceMax) and district in (:district) " +
            "order by price")
    fun findWithDistrict(type: List<Byte>, city: Short, district: List<Short>, priceMin: Int, priceMax: Int): Flux<Location>
}