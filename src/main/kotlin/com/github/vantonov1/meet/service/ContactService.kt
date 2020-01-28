package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.ContactDTO
import com.github.vantonov1.meet.entities.Contact
import com.github.vantonov1.meet.repository.ContactRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux

@Service
class ContactService(private val repository: ContactRepository) {
    fun findByPersonId(of: Int) = repository.findByOf(of).collectList()

    fun findAllByPersonId(ids: List<Int>) = repository.findAllByOf(ids).collectMultimap(Contact::of)

    fun save(personId: Int, contacts: List<ContactDTO>?) {
        if (contacts != null) {
            val entities = contacts.map {it.toEntity(personId)}
            repository.deleteAllByPersonId(personId).then(
            repository.saveAll(Flux.fromIterable(entities)).collectList()).subscribe()
        }
    }

    fun deleteAll(personId: Int) {
       repository.deleteAllByPersonId(personId).subscribe()
    }
}