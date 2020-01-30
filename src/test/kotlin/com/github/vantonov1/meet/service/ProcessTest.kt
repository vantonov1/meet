package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.*
import com.github.vantonov1.meet.entities.ContactTypes
import com.github.vantonov1.meet.entities.EquityType
import com.github.vantonov1.meet.entities.RequestType
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner

@RunWith(SpringRunner::class)
@SpringBootTest
class ProcessTest {
    @Autowired
    lateinit var requestService: RequestService

    @Autowired
    lateinit var agentService: AgentService

    @Autowired
    lateinit var equityService: EquityService

    val phone = ContactDTO(ContactTypes.PHONE.value, "32232322")
    val mail = ContactDTO(ContactTypes.MAIL.value, "aaa@bbb.com")
    val telegram = ContactDTO(ContactTypes.TELEGRAM.value, "32232322")

    @Test
    fun testRequest() {
        val agentId = agentService.save(AgentDTO(null, "Avicenna", listOf(mail), 2)).block()
        agentService.setActive(agentId!!, true).block()

        val seller = CustomerDTO(null, "Martin Luther", listOf(phone), 2)
        val requestToSale = requestService.save(RequestDTO(null, RequestType.SELL.value, null, seller, null)).block()
        assert(requestToSale?.assignedTo != null &&  requestToSale.assignedTo?.id !=null)
        val assignedTo = requestToSale?.assignedTo?.id
        assert(assignedTo == agentId)

        val agentInbox = requestService.findByPersons(null, agentId).collectList().block()
        assert(!agentInbox.isNullOrEmpty() && agentInbox[0].assignedTo?.id == agentId)

        val address = AddressDTO(2, null, null, null, null, null, null)
        val equity = EquityDTO(null, EquityType.SALE_ROOM.name, requestToSale!!.issuedBy.id, address, 100500, 100, 5, "test", agentId, null)
        val equityId = equityService.save(equity).block()

    }
}