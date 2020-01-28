package com.github.vantonov1.meet.dto

import com.github.vantonov1.meet.entities.Contact

data class ContactDTO(
        val contactType: Byte,
        val contact: String
) {
    fun toEntity(personId: Int): Contact =  Contact(personId, contactType, contact)
}

fun fromEntity(contact: Contact) = ContactDTO(contact.contactType, contact.contact)