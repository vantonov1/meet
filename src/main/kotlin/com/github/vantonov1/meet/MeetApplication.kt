package com.github.vantonov1.meet

import io.r2dbc.pool.ConnectionPool
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.data.r2dbc.connectionfactory.R2dbcTransactionManager
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories
import org.springframework.transaction.TransactionManager
import org.springframework.transaction.annotation.TransactionManagementConfigurer
import org.springframework.web.reactive.config.EnableWebFlux


@SpringBootApplication
@EnableWebFlux
@EnableR2dbcRepositories
@Suppress("unused")
class MeetApplication(val connectionFactory: ConnectionPool) : TransactionManagementConfigurer {
    override fun annotationDrivenTransactionManager(): TransactionManager {
        return R2dbcTransactionManager(connectionFactory)
    }

}

fun main(args: Array<String>) {
    SpringApplication.run(MeetApplication::class.java, *args)
}
