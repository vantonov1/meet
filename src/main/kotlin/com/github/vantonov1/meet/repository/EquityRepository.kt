package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Equity
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface EquityRepository : ReactiveCrudRepository<Equity, Long> {
    @Query("select * from equity where id=:id and hidden is null")
    override fun findById(id: Long): Mono<Equity>

    @Query("update equity set hidden = true where id = :id")
    fun hide(id: Long): Mono<Void>

    @Query("update equity set hidden = null where id = :id")
    fun expose(id: Long): Mono<Void>

    @Query("select * from equity where type=:type and city=:city and street=:street and hidden is null limit :limit")
    fun findByAddress(type: Byte, city: Short, street: String, limit: Int = 100): Flux<Equity>

    @Query("select * from equity where type=:type and city=:city and street=:street and building = :building and hidden is null limit :limit")
    fun findByAddress(type: Byte, city: Short, street: String, building: String?, limit: Int = 20): Flux<Equity>
}