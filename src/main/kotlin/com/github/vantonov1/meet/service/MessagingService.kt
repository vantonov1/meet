package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.entities.MessageToken
import com.github.vantonov1.meet.repository.MessageTokenRepository
import com.github.vantonov1.meet.service.impl.sendMessage
import org.springframework.stereotype.Service
import org.springframework.web.server.ServerWebInputException

@Service
class MessagingService(val repository: MessageTokenRepository) {
    fun registerToken(personId: Int, token: String) {
        if (repository.existsById(personId)) repository.save(MessageToken(personId, token))
        else repository.insert(personId, token)
    }

    fun sendMessage(personId: Int, text: String) {
        val person = repository.findById(personId)
        if (person.isEmpty) throw ServerWebInputException("Агент без message token")
        else sendMessage(person.get().token, text)
    }
}