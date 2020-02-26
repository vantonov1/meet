package com.github.vantonov1.meet.filter

import com.github.vantonov1.meet.service.impl.getAuthorities
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseToken
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.authentication.InsufficientAuthenticationException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.filter.GenericFilterBean
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest


const val BEARER = "Bearer "


class FirebaseFilter : GenericFilterBean() {
    override fun doFilter(request: ServletRequest, response: ServletResponse, chain: FilterChain) {
        if (request is HttpServletRequest) {
            val header = request.getHeader(HttpHeaders.AUTHORIZATION)
            if (header != null && header.length > BEARER.length) {
                try {
                    val idToken = FirebaseAuth.getInstance().verifyIdToken(header.substring(BEARER.length))
                    val context = SecurityContextHolder.createEmptyContext()
                    context.authentication = FirebaseAuthenticationToken(idToken)
                    context.authentication.isAuthenticated = true
                    SecurityContextHolder.setContext(context)
                } catch (e: Exception) {
                    throw FirebaseException("Ошибка авторизации")
                }
            }
        }
        chain.doFilter(request, response)
    }
}

class FirebaseAuthenticationToken(val user: FirebaseToken) : AbstractAuthenticationToken(getAuthorities(user)) {
    override fun getCredentials() = ""
    override fun getPrincipal() = user
}

@ResponseStatus(HttpStatus.UNAUTHORIZED)
class FirebaseException(msg: String, exception: Throwable? = null) : InsufficientAuthenticationException(msg, exception)
