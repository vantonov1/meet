package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Request
import org.springframework.data.jdbc.repository.query.Modifying
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface RequestRepository : CrudRepository<Request, Int> {
    @Query("select * from request where issued_by=:issuedBy")
    fun findByIssuer(issuedBy: Int): List<Request>
    @Query("select * from request where assigned_to=:assignedTo")
    fun findByAssignee(assignedTo: Int): List<Request>

    @Modifying
    @Query("update request set about=:equityId where id=:id")
    fun attachEquity(equityId: Long, id: Int): Boolean
}