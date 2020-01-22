package com.github.vantonov1.meet.entities

import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("equity")
data class PriceRange(
        @Column("MINPRICE")
        val minPrice: Int,
        @Column("MAXPRICE")
        val maxPrice: Int
)