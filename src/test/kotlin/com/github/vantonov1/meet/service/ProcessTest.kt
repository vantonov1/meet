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
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

@RunWith(SpringRunner::class)
@SpringBootTest
class ProcessTest {
    @Autowired
    lateinit var requestService: RequestService

    @Autowired
    lateinit var agentService: AgentService

    @Autowired
    lateinit var equityService: EquityService

    @Autowired
    lateinit var meetingService: MeetingService

    val phone = ContactDTO(ContactTypes.PHONE.name, "32232322")
    val mail = ContactDTO(ContactTypes.MAIL.name, "aaa@bbb.com")
    val telegram = ContactDTO(ContactTypes.TELEGRAM.name, "32232322")

    @Test
    fun testRequest() {
        val agentId = agentService.save(AgentDTO(null, "Avicenna", listOf(mail), 2)).block()
        agentService.setActive(agentId!!, true).block()
        val agent = agentService.findById(agentId).block()
        assert(agent!!.id == agentId)

        val seller = CustomerDTO(null, "Martin Luther", listOf(phone), 2)
        val requestToSale = requestService.save(RequestDTO(null, RequestType.SELL.name, null, seller, null, null, listOf())).block()
        assert(requestToSale!!.assignedTo?.id == agentId)

        val agentInbox = requestService.findByPersons(null, agentId).collectList().block()
        assert(!agentInbox.isNullOrEmpty() && agentInbox[0].assignedTo?.id == agentId)

        val address = AddressDTO(2, null, null, null, null, null, null)
        val equity = EquityDTO(null, EquityType.SALE_ROOM.name, requestToSale.issuedBy.id, address, 100500, 100, 5, "test", agentId, null)
        val equityId = equityService.save(equity).block()

        val buyer = CustomerDTO(null, "Pinoccio", listOf(telegram), 2)
        val createdEquity = equityService.findById(equityId!!).block()
        val requestToBuy = requestService.save(RequestDTO(null, RequestType.BUY.name, createdEquity, buyer, null, null, listOf())).block()
        assert(requestToBuy!!.assignedTo?.id == agentId)

        val schedule = ZonedDateTime.now().plusDays(1).format(DateTimeFormatter.ISO_ZONED_DATE_TIME)
        val meetingId = meetingService.save(MeetingDTO(null, requestToBuy.id!!, createdEquity, agent, requestToBuy.issuedBy, schedule, "123")).block()
        val today = ZonedDateTime.now().truncatedTo(ChronoUnit.DAYS)
        val buyerInbox = meetingService.findByPersons(agentId, null, today, today.plusDays(7)).collectList().block()
        assert(!buyerInbox.isNullOrEmpty() && buyerInbox[0].attends.id == requestToBuy.issuedBy.id && buyerInbox[0].at!!.id == equityId)

        meetingService.delete(meetingId!!).block()
        val cleanInbox = meetingService.findByPersons(agentId, null,today, today.plusDays(7)).collectList().block()
        assert(cleanInbox.isNullOrEmpty())
    }
}