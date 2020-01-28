package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Customer
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface CustomerRepository : ReactiveCrudRepository<Customer, Int>