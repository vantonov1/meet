package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Equity
import com.github.vantonov1.meet.entities.Location
import com.github.vantonov1.meet.entities.Photo
import com.github.vantonov1.meet.entities.PriceRange
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

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

@Repository
interface EquityRepository : ReactiveCrudRepository<Equity, Long> {
    @Query("select * from equity where id=(:id) and hidden is null")
    override fun findById(id: Long): Mono<Equity>

    @Query("update equity set hidden = true where id = :id")
    fun hide(id: Long): Mono<Void>

    @Query("update equity set hidden = null where id = :id")
    fun expose(id: Long): Mono<Void>
}

@Repository
interface EquityPriceRangeRepository : ReactiveCrudRepository<PriceRange, Long> {
    @Query("select min(price) as minPrice, max(price) as maxPrice from equity where type in (:type) and city = :city and hidden is null ")
    fun getPriceRange(type: List<Byte>, city: Short): Mono<PriceRange>

    @Query("select min(price), max(price) from equity where type in (:type) and city = :city and hidden is null " +
            " and district in (:district) and subway in (:subway)")
    fun getPriceRangeWithDistrictAndSubway(type: List<Byte>, city: Short, district: List<Short>, subway: List<String>): Mono<PriceRange>

    @Query("select min(price), max(price) from equity where type in (:type) and city = :city and hidden is null " +
            " and subway in (:subway)")
    fun getPriceRangeWithSubway(type: List<Byte>, city: Short, subway: List<String>): Mono<PriceRange>

    @Query("select min(price), max(price) from equity where type in (:type) and city = :city and hidden is null " +
            " and district in (:district)")
    fun getPriceRangeWithDistrict(type: List<Byte>, city: Short, district: List<Short>): Mono<PriceRange>
}

@Repository
interface PhotoRepository : ReactiveCrudRepository<Photo, String> {
    @Query("select * from photo where of=:of")
    fun findByOf(of: Long): Flux<Photo>

    @Query("select * from photo where of in (:of)")
    fun findAllByOf(of: List<Long>): Flux<Photo>

    @Query("insert into photo values (")
    override fun <S : Photo?> saveAll(entities: MutableIterable<S>): Flux<S>

}
