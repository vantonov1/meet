package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.entities.Admin
import com.github.vantonov1.meet.repository.AdminRepository
import com.github.vantonov1.meet.service.impl.InvitationSender
import com.github.vantonov1.meet.service.impl.invitation
import com.github.vantonov1.meet.service.impl.saveClaim
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Service
import org.springframework.web.server.ServerWebInputException
import javax.annotation.PostConstruct


@Service
class AdminService(val repository: AdminRepository, val invitationSender: InvitationSender) {
    @Value("\${admin.email}")
    lateinit var adminEmail: String

    fun findAll() = repository.findAll().map { it.email }.toList()

    fun invite(email: String, base: String): Admin {
        val saved = repository.save(Admin(null, invitation(), email))
        invitationSender.sendInviteByMail(saved.email, base, saved.invitation)
        return saved
    }

    fun register(invitation: String, token: Authentication) =
            if (invitation.isEmpty())
                throw ServerWebInputException("Неизвестное приглашение")
            else {
                val invited = repository.findByInvitation(invitation)
                if (invited.isNotEmpty()) {
                    saveClaim(token, Pair("admin", true))
                    repository.save(invited[0].copy(invitation = ""))
                } else
                    throw ServerWebInputException("Неизвестное приглашение")
            }

    @PostConstruct
    @Suppress("unused")
    private fun init() {
//        val admin = repository.findByEmail(adminEmail)
//        if (admin.isEmpty())
//            repository.save(Admin(null, adminEmail, adminEmail))
    }
}