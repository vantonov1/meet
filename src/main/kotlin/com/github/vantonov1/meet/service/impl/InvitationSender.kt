package com.github.vantonov1.meet.service.impl

import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.MailException
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Component

@Component
class InvitationSender (val mailSender: JavaMailSender){
    @Value("\${spring.mail.username}")
    lateinit var from: String

    fun sendInviteByMail(email: String, base: String, invitation: String) {
        val msg = SimpleMailMessage()
        msg.setTo(email)
        msg.setFrom(from)
        msg.setSubject("Приглашение для регистрации на сайте Митилка")
        msg.setText("$base$invitation")
        try {
            mailSender.send(msg)
        } catch (ex: MailException) { // simply log it and go on...
            System.err.println(ex.message)
        }
    }
}