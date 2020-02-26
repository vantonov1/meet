package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.CustomerDTO
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.repository.CustomerRepository
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import org.springframework.web.server.ServerWebInputException

@Service
@DependsOn("liquibase")
class CustomerService(val repository: CustomerRepository, val contactService: ContactService) {
    fun save(dto: CustomerDTO): CustomerDTO {
        val saved = repository.save(dto.toEntity())
        return fromEntity(saved, contactService.save(saved.id!!, dto.contacts))
    }

    fun delete(id: Int) = repository.deleteById(id)

    fun findById(id: Int): CustomerDTO {
        val c = repository.findById(id)
        return if (c.isEmpty) throw ServerWebInputException("Пользователь не найден")
        else fromEntity(c.get(), contactService.findByPersonId(id))
    }
}