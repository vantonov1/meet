package com.github.vantonov1.meet.dto

import com.github.vantonov1.meet.entities.Customer

data class CustomerDTO(
        val id: Int? = null,
        val name: String,
        val contacts: List<ContactDTO>
) {
    fun toEntity(): Customer = Customer(id, name)
}

fun fromEntity(customer: Customer, contacts: List<ContactDTO>) = CustomerDTO(customer.id!!, customer.name, contacts)