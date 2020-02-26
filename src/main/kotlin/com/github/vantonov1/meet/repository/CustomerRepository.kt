package com.github.vantonov1.meet.repository

import com.github.vantonov1.meet.entities.Customer
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface CustomerRepository : CrudRepository<Customer, Int>