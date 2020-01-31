package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.AgentDTO
import com.github.vantonov1.meet.dto.ContactDTO
import com.github.vantonov1.meet.entities.ContactTypes
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner

@RunWith(SpringRunner::class)
@SpringBootTest
class AgentServiceTest {

    @Autowired
    lateinit var agentService: AgentService

    @Test
    fun testCRUD() {
        val phone = ContactDTO(ContactTypes.PHONE.name, "32232322")
        val mail = ContactDTO(ContactTypes.MAIL.name, "aaa@bbb.com")
        val telegram = ContactDTO(ContactTypes.TELEGRAM.name, "32232322")
        val id = agentService.save(AgentDTO(null, "Bond", listOf(phone), 2)).block()
        val created = agentService.findById(id!!).block()
        assert(created != null && created.name == "Bond" && created.contacts.size == 1)
        agentService.save(AgentDTO(id, "James Bond", listOf(mail, telegram), 2)).block()
        val updated = agentService.findById(id).block()
        assert(updated != null && updated.name == "James Bond" && updated.contacts.size == 2)
    }
}