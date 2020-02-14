package com.github.vantonov1.meet.service.impl

import com.github.vantonov1.meet.filter.FirebaseAuthenticationToken
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseToken
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import reactor.core.publisher.Mono
import java.net.URLEncoder
import java.util.*

val CLAIMS = listOf("admin", "agent")

fun invitation(): String = URLEncoder.encode(UUID.randomUUID().toString(), "UTF-8")
fun saveClaim(token: Authentication, claim: Pair<String, Any>) =
        if (token is FirebaseAuthenticationToken) {
            val claims = mutableMapOf<String, Any>()
            CLAIMS.forEach {
                val existingClaim = token.user.claims[it]
                if(existingClaim != null) {
                    claims[it] = existingClaim;
                }
            }
            claims[claim.first] = claim.second
            Mono.just(FirebaseAuth.getInstance().setCustomUserClaims(token.user.uid, claims))
        } else
            Mono.error(BadCredentialsException("Неавторизованный запрос"))

fun getAuthorities(user: FirebaseToken): Collection<GrantedAuthority> {
    val result = mutableListOf<GrantedAuthority>()
    CLAIMS.forEach {
        val claim = user.claims[it]
        if(claim != null)
            result.add(SimpleGrantedAuthority("ROLE_${it.toUpperCase()}"))
    }
    return result
}

