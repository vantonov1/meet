package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.CustomerDTO
import com.github.vantonov1.meet.dto.RequestDTO
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.entities.Request
import com.github.vantonov1.meet.repository.RequestRepository
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import org.springframework.web.server.ServerWebInputException
import java.time.ZonedDateTime

@Service
@DependsOn("liquibase")
class RequestService(private val requestRepository: RequestRepository,
                     private val customerService: CustomerService,
                     private val agentService: AgentService,
                     private val meetingService: MeetingService,
                     private val equityService: EquityService,
                     private val commentService: CommentService,
                     private val messagingService: MessagingService
) {
    fun save(dto: RequestDTO, customerId: Int?): RequestDTO {
        assert(dto.assignedTo == null)
        return if (customerId == null) {
            if (dto.issuedBy == null) throw ServerWebInputException("Не указан пользователь")
            val customer = customerService.save(dto.issuedBy)
            assignFromCustomer(dto, dto.issuedBy.copy(id = customer.id))
        } else {
            assignFromCustomer(dto, customerService.findById(customerId))
        }
    }

    fun attachEquity(equityId: Long, id: Int) {
        if (!requestRepository.attachEquity(equityId, id))
            throw ServerWebInputException("Заявка не найдена")
    }

    fun delete(id: Int) = requestRepository.deleteById(id)

    fun findById(id: Int): RequestDTO {
        val request = requestRepository.findById(id)
        if (request.isEmpty)
            throw ServerWebInputException("Заявка не найдена")
        return collectRequestInfo(request.get())
    }

    fun findByPersons(issuedBy: Int?, assignedTo: Int?): List<RequestDTO> {
        return if (issuedBy != null) requestRepository.findByIssuer(issuedBy).map { collectRequestInfo(it) }
        else if (assignedTo != null) requestRepository.findByAssignee(assignedTo).map { collectRequestInfo(it) }
        else listOf()
    }

    private fun assignFromCustomer(dto: RequestDTO, customer: CustomerDTO):  RequestDTO {
        val agentId =
                if (dto.about?.responsible != null) dto.about.responsible
                else agentService.selectAgent(dto, customer)
        val request = requestRepository.save(dto.toEntity(customer.id!!, agentId))
        messagingService.sendMessage(request.assignedTo, "Новая заявка", customer.name, "assigned-requests")
        return collectRequestInfo(request)
    }

    private fun collectRequestInfo(req: Request): RequestDTO {
        val issuedBy = customerService.findById(req.issuedBy)
        val assignedTo = agentService.findById(req.assignedTo)
        if (req.about != null) {
            val equity = equityService.findById(req.about)
            val meeting = meetingService.findDateByRequest(req.id!!)
            val comments = commentService.findCustomerCommentsByEquity(req.issuedBy, req.about)
            return fromEntity(req, equity, issuedBy, assignedTo, if (meeting.isBefore(ZonedDateTime.now())) null else meeting, comments)
        } else {
            return fromEntity(req, null, issuedBy, assignedTo, null, listOf())
        }
    }

    fun completeRequest(sellId: Int, buyId: Int, equityId: Long, contractNumber: String?) {
        requestRepository.deleteById(sellId)
        requestRepository.deleteById(buyId)
        equityService.delete(equityId, false)
    }
}