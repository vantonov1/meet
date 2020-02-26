package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Photo
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface PhotoRepository : CrudRepository<Photo, String> {
    @Query("select * from photo where of=:of")
    fun findByOf(of: Long): List<Photo>

    @Query("select * from photo where of in (:of)")
    fun findAllByOf(of: List<Long>): List<Photo>
}
