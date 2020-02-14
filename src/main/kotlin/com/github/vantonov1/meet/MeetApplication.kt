package com.github.vantonov1.meet

import com.github.vantonov1.meet.filter.BearerTokenReactiveAuthenticationManager
import com.github.vantonov1.meet.filter.FirebaseAuthenticationConverter
import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import io.r2dbc.pool.ConnectionPool
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.context.annotation.Bean
import org.springframework.data.r2dbc.connectionfactory.R2dbcTransactionManager
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.SecurityWebFiltersOrder
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.security.web.server.authentication.AuthenticationWebFilter
import org.springframework.security.web.server.util.matcher.OrServerWebExchangeMatcher
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers
import org.springframework.transaction.TransactionManager
import org.springframework.transaction.annotation.TransactionManagementConfigurer
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.reactive.config.CorsRegistry
import org.springframework.web.reactive.config.EnableWebFlux
import org.springframework.web.reactive.config.WebFluxConfigurer


@SpringBootApplication
@EnableWebFlux
@EnableWebFluxSecurity
@EnableR2dbcRepositories
@Suppress("unused")
class MeetApplication(val connectionFactory: ConnectionPool) : TransactionManagementConfigurer, WebFluxConfigurer {
    override fun annotationDrivenTransactionManager(): TransactionManager {
        return R2dbcTransactionManager(connectionFactory)
    }

    override fun addCorsMappings(corsRegistry: CorsRegistry) {
        corsRegistry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("PUT", "GET", "POST", "DElETE")
    }

//    @Bean
    fun firebaseAuthenticationFilter(): AuthenticationWebFilter {
        val authenticationManager = BearerTokenReactiveAuthenticationManager()
        val authenticationConverter = FirebaseAuthenticationConverter()
        val webFilter = AuthenticationWebFilter(authenticationManager)
        webFilter.setServerAuthenticationConverter(authenticationConverter)
        webFilter.setRequiresAuthenticationMatcher(
                OrServerWebExchangeMatcher(
                        ServerWebExchangeMatchers.pathMatchers(HttpMethod.GET, "/api/auth/**"),
                        ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST, "/api/auth/**"),
                        ServerWebExchangeMatchers.pathMatchers(HttpMethod.PUT, "/api/auth/**"),
                        ServerWebExchangeMatchers.pathMatchers(HttpMethod.DELETE, "/api/auth/**")
                )
        )
        return webFilter
    }

    @Bean
    fun springSecurityFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain {
        http
                .addFilterAt(firebaseAuthenticationFilter(), SecurityWebFiltersOrder.AUTHENTICATION)
                .cors().configurationSource {
                    val c = CorsConfiguration().applyPermitDefaultValues()
                    c.addAllowedMethod(HttpMethod.PUT)
                    c
                }
                .and().csrf().disable()
        return http.build()
    }
}

fun main(args: Array<String>) {
    FirebaseApp.initializeApp(FirebaseOptions.Builder()
            .setCredentials(GoogleCredentials.getApplicationDefault())
            .setDatabaseUrl("https://meetilka.firebaseio.com")
            .build())

     SpringApplication.run(MeetApplication::class.java, *args)
}