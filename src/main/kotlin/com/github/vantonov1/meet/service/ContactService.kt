package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.ContactDTO
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.repository.ContactRepository
import org.springframework.stereotype.Service

@Service
class ContactService(private val repository: ContactRepository) {
    fun findByPersonId(of: Int) = repository.findByOf(of).map { fromEntity(it) }

    fun findAllByPersonId(ids: List<Int>): Map<Int, MutableList<ContactDTO>> {
        val result = mutableMapOf<Int, MutableList<ContactDTO>>()
        repository.findAllByOf(ids)
                .forEach { result.getOrPut(it.of, {mutableListOf()}).add(fromEntity(it)) }
        return result
    }

    fun save(personId: Int, contacts: List<ContactDTO>?): List<ContactDTO> {
        if (contacts != null) {
            repository.deleteAllByPersonId(personId)
            return repository.saveAll(contacts.map { it.toEntity(personId) }).map { fromEntity(it) }
        } else
            return emptyList()
    }

    fun deleteAll(personId: Int) {
        repository.deleteAllByPersonId(personId)
    }
}