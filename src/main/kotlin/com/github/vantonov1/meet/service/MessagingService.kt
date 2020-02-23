package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.entities.MessageToken
import com.github.vantonov1.meet.repository.MessageTokenRepository
import com.github.vantonov1.meet.service.impl.sendMessage
import org.springframework.stereotype.Service
import org.springframework.web.server.ServerWebInputException
import reactor.core.publisher.Mono

@Service
class MessagingService(val repository: MessageTokenRepository) {
    fun registerToken(personId: Int, token: String) = repository.existsById(personId).flatMap { exists ->
        if (exists) repository.save(MessageToken(personId, token))
        else repository.insert(personId, token)
    }

    fun sendMessage(personId: Int, text: String) =
            repository.findById(personId)
            .switchIfEmpty(Mono.error(ServerWebInputException("Агент без message token")))
            .map { sendMessage(it.token, text) }
}