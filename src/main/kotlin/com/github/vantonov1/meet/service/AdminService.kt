package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.entities.Admin
import com.github.vantonov1.meet.filter.FirebaseAuthenticationToken
import com.github.vantonov1.meet.repository.AdminRepository
import com.github.vantonov1.meet.service.impl.invitation
import com.github.vantonov1.meet.service.impl.saveClaim
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import javax.annotation.PostConstruct

@Service
class AdminService(val repository: AdminRepository) {
    @Value("\${admin.email}")
    lateinit var adminEmail: String

    fun findAll() = repository.findAll().map { it.email }.collectList()

    fun invite(email: String) = invite(invitation(), email)

    fun register(invitation: String, token: Authentication) =
        if (invitation.isEmpty())
             Mono.error(IllegalArgumentException("Неизвестное приглашение"))
        else repository.findByInvitation(invitation).collectList().flatMap { invited ->
            if (invited.isNotEmpty()) {
                saveClaim(token, Pair("admin", true))
                        .then(repository.save(invited[0].copy(invitation = "")))
            } else
                Mono.error(IllegalArgumentException("Неизвестное приглашение"))
        }

    fun isAdmin(token: Authentication) = token is FirebaseAuthenticationToken && token.user.claims.containsKey("admin")

    private fun invite(invitation: String, email: String) =
            repository.save(Admin(null, invitation, email))


    @PostConstruct
    private fun init() {
        repository.findByEmail(adminEmail).hasElements().flatMap { found ->
            if (!found)
                invite(adminEmail, adminEmail)
            else
                Mono.empty()
        }.subscribe()
    }
}