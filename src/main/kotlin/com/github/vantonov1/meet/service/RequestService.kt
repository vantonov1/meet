package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.CustomerDTO
import com.github.vantonov1.meet.dto.RequestDTO
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.entities.Request
import com.github.vantonov1.meet.repository.RequestRepository
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import org.springframework.web.server.ServerWebInputException
import java.time.ZonedDateTime
import java.util.*

@Service
@DependsOn("liquibase")
class RequestService(private val requestRepository: RequestRepository,
                     private val customerService: CustomerService,
                     private val agentService: AgentService,
                     private val meetingService: MeetingService,
                     private val equityService: EquityService,
                     private val commentService: CommentService,
                     private val messagingService: MessagingService,
                     private val cacheManager: CacheManager
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

    @CacheEvict(key = "#id", cacheNames = ["requestsById"])
    fun attachEquity(equityId: Long, id: Int) {
        evictPersons(id)
        if (!requestRepository.attachEquity(equityId, id))
            throw ServerWebInputException("Заявка не найдена")
    }

    @CacheEvict(key = "#id", cacheNames = ["requestsById"])
    fun delete(id: Int) {
        evictPersons(id)
        requestRepository.deleteById(id)
    }

    @Cacheable(key = "#id", cacheNames = ["requestsById"])
    fun findById(id: Int): RequestDTO {
        val request = requestRepository.findById(id)
        if (request.isEmpty)
            throw ServerWebInputException("Заявка не найдена")
        return collectRequestInfo(request.get())
    }


    @Cacheable(key = "#id", cacheNames = ["requestsByPerson"])
    fun findByIssuer(id: Int) = requestRepository.findByIssuer(id).map { collectRequestInfo(it) }

    @Cacheable(key = "#id", cacheNames = ["requestsByPerson"])
    fun findByAssignee(id: Int) = requestRepository.findByAssignee(id).map { collectRequestInfo(it) }

    fun completeRequest(sellId: Int, buyId: Int, equityId: Long, contractNumber: String?) {
        evictPersons((sellId))
        delete((sellId))
        evictPersons((buyId))
        delete((buyId))
        equityService.delete(equityId, false)
    }

    private fun assignFromCustomer(dto: RequestDTO, customer: CustomerDTO): RequestDTO {
        val agentId =
                if (dto.about?.responsible != null) dto.about.responsible
                else agentService.selectAgent(dto, customer)
        val request = saveRequest(dto, customer, agentId)
        messagingService.sendMessage(request.assignedTo, "Новая заявка", customer.name, "assigned-requests")
        return collectRequestInfo(request)
    }

    private fun collectRequestInfo(req: Request): RequestDTO {
        val issuedBy = customerService.findById(req.issuedBy)
        val assignedTo = agentService.findById(req.assignedTo)
        return if (req.about != null) {
            val equity = equityService.findById(req.about)
            val meeting = meetingService.findDateByRequest(req.id!!)
            val comments = commentService.findCustomerCommentsByEquity(req.issuedBy, req.about)
            fromEntity(req, equity, issuedBy, assignedTo, if (meeting.isBefore(ZonedDateTime.now())) null else meeting, comments)
        } else
            fromEntity(req, null, issuedBy, assignedTo, null, listOf())
    }

    private fun saveRequest(dto: RequestDTO, customer: CustomerDTO, agentId: Int): Request {
        val cache = cacheManager.getCache("requestsByPerson")
        cache?.evict(agentId)
        cache?.evict(customer.id!!)
        return requestRepository.save(dto.toEntity(customer.id!!, agentId))
    }

    private fun evictPersons(id: Int?) {
        val request = if (id != null) requestRepository.findById(id) else Optional.empty()
        if (request.isPresent) {
            val cache = cacheManager.getCache("requestsByPerson")
            cache?.evict(request.get().issuedBy)
            cache?.evict(request.get().assignedTo)
        }
    }
}