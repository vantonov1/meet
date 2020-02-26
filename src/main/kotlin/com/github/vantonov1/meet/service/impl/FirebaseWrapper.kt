package com.github.vantonov1.meet.service.impl

import com.github.vantonov1.meet.filter.FirebaseAuthenticationToken
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseToken
import com.google.firebase.messaging.*
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.InsufficientAuthenticationException
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.server.ServerWebInputException
import java.net.URLEncoder
import java.util.*


val CLAIMS = listOf("admin", "agent")

fun invitation(): String = URLEncoder.encode(UUID.randomUUID().toString(), "UTF-8")

fun getFirebaseAuthenticationToken(authentication: Authentication) =
        if (authentication is FirebaseAuthenticationToken) authentication
        else throw BadCredentialsException("Неавторизованный запрос")


fun saveClaim(authentication: Authentication, claim: Pair<String, Any>) {
    val token = getFirebaseAuthenticationToken(authentication)
    val claims = mutableMapOf<String, Any>()
    CLAIMS.forEach {
        val existingClaim = token.user.claims[it]
        if (existingClaim != null) {
            claims[it] = existingClaim
        }
    }
    claims[claim.first] = claim.second
    FirebaseAuth.getInstance().setCustomUserClaims(token.user.uid, claims)
}

fun getAuthorities(user: FirebaseToken): Collection<GrantedAuthority> {
    val result = mutableListOf<GrantedAuthority>()
    CLAIMS.forEach {
        val claim = user.claims[it]
        if (claim != null)
            result.add(SimpleGrantedAuthority("ROLE_${it.toUpperCase()}"))
    }
    return result
}

fun getAgentId(): Int {
    val context = SecurityContextHolder.getContext()
    if (context.authentication is FirebaseAuthenticationToken) {
        val id: Any? = (context.authentication as FirebaseAuthenticationToken).user.claims["agent"]
        return if (id is Number) id.toInt()
        else throw InsufficientAuthenticationException("Пользователь не является агентом")
    } else
        throw InsufficientAuthenticationException("Пользователь не авторизован")
}

fun sendMessage(messagingToken: String?, text: String): String {
    if (messagingToken != null) {
        val message: Message = Message.builder()
                .setNotification(Notification.builder().setTitle(text).setBody(text).build())
                .setToken(messagingToken)
                .setFcmOptions(FcmOptions.withAnalyticsLabel("debug"))
                .setWebpushConfig(WebpushConfig.builder().setFcmOptions(WebpushFcmOptions.withLink("http://localhost:3000")).build())
                .build()
        return FirebaseMessaging.getInstance().send(message)
    } else {
        throw ServerWebInputException("Агент без message token")
    }
}

