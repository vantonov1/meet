package com.github.vantonov1.meet.filter

import com.github.vantonov1.meet.service.impl.getAuthorities
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseToken
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.authentication.InsufficientAuthenticationException
import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.core.Authentication
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono
import reactor.core.scheduler.Schedulers


const val BEARER = "Bearer ";

class FirebaseAuthenticationConverter : ServerAuthenticationConverter {

    override fun convert(exchange: ServerWebExchange): Mono<Authentication?>? {
        val header = exchange.request.headers.getFirst(HttpHeaders.AUTHORIZATION)
        return if (header != null && header.length > BEARER.length)
            Mono.fromCallable { FirebaseAuth.getInstance().verifyIdToken(header.substring(BEARER.length)) }
                .subscribeOn(Schedulers.boundedElastic())
                .onErrorResume { Mono.error(FirebaseException("Ошибка авторизации", it)) }
                .map { FirebaseAuthenticationToken(it) }
        else
            Mono.error(FirebaseException("Требуется авторизация"))
    }

}

class BearerTokenReactiveAuthenticationManager : ReactiveAuthenticationManager {
    override fun authenticate(authentication: Authentication): Mono<Authentication> {
        authentication.isAuthenticated = true;
        return Mono.just(authentication)
    }
}

class FirebaseAuthenticationToken(val user: FirebaseToken) : AbstractAuthenticationToken(getAuthorities(user)) {
    override fun getCredentials() = ""
    override fun getPrincipal() = user
}

@ResponseStatus(HttpStatus.UNAUTHORIZED)
class FirebaseException(msg: String, exception: Throwable? = null) : InsufficientAuthenticationException(msg, exception)
