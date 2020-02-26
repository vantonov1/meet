package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Equity
import org.springframework.data.jdbc.repository.query.Modifying
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface EquityRepository : CrudRepository<Equity, Long> {
    @Query("select * from equity where id=:id and hidden is null")
    override fun findById(id: Long): Optional<Equity>

    @Modifying
    @Query("update equity set hidden = true where id = :id")
    fun hide(id: Long): Int

    @Modifying
    @Query("update equity set hidden = null where id = :id")
    fun expose(id: Long): Int

    @Query("select * from equity where type=:type and city=:city and street=:street and hidden is null limit :limit")
    fun findByAddress(type: Byte, city: Short, street: String, limit: Int = 100): List<Equity>

    @Query("select * from equity where type=:type and city=:city and street=:street and building = :building and hidden is null limit :limit")
    fun findByAddress(type: Byte, city: Short, street: String, building: String?, limit: Int = 20): List<Equity>
}