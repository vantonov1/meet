package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Photo
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface PhotoRepository : ReactiveCrudRepository<Photo, String> {
    @Query("select * from photo where of=:of")
    fun findByOf(of: Long): Flux<Photo>

    @Query("select * from photo where of in (:of)")
    fun findAllByOf(of: List<Long>): Flux<Photo>
}
