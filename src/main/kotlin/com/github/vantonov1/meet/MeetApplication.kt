package com.github.vantonov1.meet

import com.github.vantonov1.meet.filter.FirebaseFilter
import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.data.jdbc.repository.config.EnableJdbcRepositories
import org.springframework.http.CacheControl
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import java.util.concurrent.TimeUnit


@SpringBootApplication
@EnableGlobalMethodSecurity(securedEnabled = true)
@EnableWebSecurity
@EnableJdbcRepositories
@Suppress("unused")
class MeetApplication : WebSecurityConfigurerAdapter(), WebMvcConfigurer {
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

    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/static/")
                .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
    }
}

fun main(args: Array<String>) {
    FirebaseApp.initializeApp(FirebaseOptions.Builder()
            .setCredentials(GoogleCredentials.getApplicationDefault())
            .setDatabaseUrl("https://meetilka.firebaseio.com")
            .build())

     SpringApplication.run(MeetApplication::class.java, *args)
}