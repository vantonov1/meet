package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Contact
import org.springframework.data.jdbc.repository.query.Modifying
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ContactRepository : CrudRepository<Contact, Int> {
    @Query("select * from contact where of=:of")
    fun findByOf(of: Int): List<Contact>

    @Query("select * from contact where of in (:of)")
    fun findAllByOf(of: List<Int>): List<Contact>

    @Modifying
    @Query("delete from contact where of=:of")
    fun deleteAllByPersonId(of: Int): Int
}