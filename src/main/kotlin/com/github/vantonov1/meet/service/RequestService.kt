package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.CustomerDTO
import com.github.vantonov1.meet.dto.RequestDTO
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.entities.Request
import com.github.vantonov1.meet.repository.RequestRepository
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import org.springframework.web.server.ServerWebInputException
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.ZonedDateTime

@Service
@DependsOn("liquibase")
class RequestService(private val requestRepository: RequestRepository,
                     private val customerService: CustomerService,
                     private val agentService: AgentService,
                     private val meetingService: MeetingService,
                     private val equityService: EquityService,
                     private val commentService: CommentService
) {
    fun save(dto: RequestDTO, customerId: Int?): Mono<RequestDTO> {
        assert(dto.assignedTo == null)
        return if (customerId == null) {
            if(dto.issuedBy == null) throw ServerWebInputException("Не указан пользователь")
            customerService.save(dto.issuedBy).flatMap { assignFromCustomer(dto, dto.issuedBy.copy(id = it)) }
        } else
            customerService.findById(customerId)
                    .flatMap {assignFromCustomer(dto, it)}
    }

    fun attachEquity(equityId: Long, id: Int?): Mono<Long> {
        return if (id != null)
            requestRepository.attachEquity(equityId, id).map { if (it) equityId else throw ServerWebInputException("Заявка не найдена") }
        else
            Mono.just(equityId)
    }

    fun delete(id: Int) = requestRepository.deleteById(id)

    fun findById(id: Int) = requestRepository.findById(id).flatMap { collectRequestInfo(it) }

    fun findByPersons(issuedBy: Int?, assignedTo: Int?): Flux<RequestDTO> {
        return if (issuedBy != null) requestRepository.findByIssuer(issuedBy).flatMap { collectRequestInfo(it) }
        else if (assignedTo != null) requestRepository.findByAssignee(assignedTo).flatMap { collectRequestInfo(it) }
        else Flux.empty()
    }

    private fun assignFromCustomer(dto: RequestDTO, customer: CustomerDTO) =
            (if (dto.about?.responsible != null) Mono.just(dto.about.responsible)
            else agentService.selectAgent(dto, customer))
                    .flatMap { agentId -> requestRepository.save(dto.toEntity(customer.id!!, agentId)) }
                    .flatMap { collectRequestInfo(it) }

    private fun collectRequestInfo(req: Request) =
            if (req.about != null) Mono.zip(
                    equityService.findById(req.about),
                    customerService.findById(req.issuedBy),
                    agentService.findById(req.assignedTo),
                    meetingService.findDateByRequest(req.id!!),
                    commentService.findCustomerCommentsByEquity(req.issuedBy, req.about)
            ).map { fromEntity(req, it.t1, it.t2, it.t3, if (it.t4.isBefore(ZonedDateTime.now())) null else it.t4, it.t5) }
            else Mono.zip(
                    customerService.findById(req.issuedBy),
                    agentService.findById(req.assignedTo)
            ).map { fromEntity(req, null, it.t1, it.t2, null, listOf()) }

    fun completeRequest(sellId: Int, buyId: Int, equityId: Long, contractNumber: String?) = Mono.zip(
            requestRepository.deleteById(sellId),
            requestRepository.deleteById(buyId),
            equityService.delete(equityId, false)
    ).then(Mono.empty<Void>())
}