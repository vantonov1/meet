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
    return tryGetAgentId() ?: throw InsufficientAuthenticationException("Пользователь не является агентом")
}

fun tryGetAgentId(): Int? {
    val context = SecurityContextHolder.getContext()
    return if (context.authentication is FirebaseAuthenticationToken) {
        val id: Any? = (context.authentication as FirebaseAuthenticationToken).user.claims["agent"]
        if (id is Number) id.toInt()
        else null
    } else null
}

fun sendMessage(messagingToken: String?, text: String, body: String, path: String = "") {
    if (messagingToken != null) {
        val message: Message = Message.builder()
            .setNotification(Notification.builder().setTitle(text).setBody(body).build())
            .setToken(messagingToken)
            .setWebpushConfig(WebpushConfig.builder().setFcmOptions(WebpushFcmOptions.withLink("https://meetilka.appspot.com/#/$path")).build())
            .build()
        FirebaseMessaging.getInstance().send(message)
    }
}

