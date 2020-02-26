package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.MessageToken
import org.springframework.data.jdbc.repository.query.Modifying
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository

interface MessageTokenRepository: CrudRepository<MessageToken, Int> {
    @Modifying
    @Query("insert into message_token values(:personId, :token)")
    fun insert(personId: Int, token: String) : Int
}