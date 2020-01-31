package com.github.vantonov1.meet.entities

import org.springframework.data.domain.Persistable
import org.springframework.data.relational.core.mapping.Table

enum class ContactTypes(val value: Byte) {
    PHONE(1), MAIL(2), SKYPE(3), TELEGRAM(4), VIBER(5), WHATSAPP(6), VK(7), FACEBOOK(8);
    companion object {
        fun valueOf(value: Byte) = RequestType.values().first { it.value == value }
    }
}

@Table
data class Contact(
        val of: Int,
        val contactType: Byte, //ContactTypes
        val contact: String
) : Persistable<String> {
    override fun isNew() = true //no contact updates
    override fun getId() = "$of $contactType $contact"
}