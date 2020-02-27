package com.github.vantonov1.meet

import org.springframework.stereotype.Component

@Component("liquibase")
//@ConditionalOnMissingBean(name = ["liquibase"])
class FakeLiquibase {}