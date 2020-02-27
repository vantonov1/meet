package com.github.vantonov1.meet

import com.github.vantonov1.meet.filter.FirebaseFilter
import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.data.jdbc.repository.config.EnableJdbcRepositories
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration


@SpringBootApplication
@EnableGlobalMethodSecurity(securedEnabled = true)
@EnableWebSecurity
@EnableJdbcRepositories
@Suppress("unused")
class MeetApplication : WebSecurityConfigurerAdapter() {
    override fun configure(http: HttpSecurity) {
        http
                .addFilterAt(FirebaseFilter(), BasicAuthenticationFilter::class.java)
                .authorizeRequests()
                .antMatchers("/api/public/**").permitAll()
                .antMatchers("/api/auth/**").authenticated()
                .and().cors().configurationSource {
                    val c = CorsConfiguration().applyPermitDefaultValues()
                    c.addAllowedMethod(HttpMethod.PUT)
                    c.addAllowedMethod(HttpMethod.DELETE)
                    c
                }
                .and().csrf().disable()
    }
}

fun main(args: Array<String>) {
    FirebaseApp.initializeApp(FirebaseOptions.Builder()
            .setCredentials(GoogleCredentials.getApplicationDefault())
            .setDatabaseUrl("https://meetilka.firebaseio.com")
            .build())

     SpringApplication.run(MeetApplication::class.java, *args)
}