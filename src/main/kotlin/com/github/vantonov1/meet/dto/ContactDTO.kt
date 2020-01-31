package com.github.vantonov1.meet.dto

import com.github.vantonov1.meet.entities.Contact
import com.github.vantonov1.meet.entities.ContactTypes

data class ContactDTO(
        val contactType: String,
        val contact: String
) {
    fun toEntity(personId: Int): Contact =  Contact(personId, ContactTypes.valueOf(contactType).value, contact)
}

fun fromEntity(contact: Contact) = ContactDTO(ContactTypes.valueOf(contact.contactType).name, contact.contact)