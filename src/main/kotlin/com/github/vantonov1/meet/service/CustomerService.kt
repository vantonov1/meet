package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.CustomerDTO
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.repository.CustomerRepository
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import org.springframework.web.server.ServerWebInputException
import reactor.core.publisher.Mono

@Service
@DependsOn("liquibase")
class CustomerService(val repository: CustomerRepository, val contactService: ContactService) {
    fun save(dto: CustomerDTO) = repository.save(dto.toEntity())
            .map { it.id!! }
            .flatMap { contactService.save(it, dto.contacts) }

    fun delete(id: Int) = repository.deleteById(id)
    fun findById(id: Int) = Mono.zip(repository.findById(id), contactService.findByPersonId(id))
            .switchIfEmpty(Mono.error(ServerWebInputException("Пользователь не найден")))
            .map {fromEntity(it.t1, it.t2.map { fromEntity(it) })}
}