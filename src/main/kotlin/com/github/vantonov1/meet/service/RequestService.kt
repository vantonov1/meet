package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.dto.RequestDTO
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.entities.Request
import com.github.vantonov1.meet.repository.RequestRepository
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
@DependsOn("liquibase")
class RequestService(private val requestRepository: RequestRepository,
                     private val customerService: CustomerService,
                     private val agentService: AgentService,
                     private val equityService: EquityService
) {
    fun save(dto: RequestDTO): Mono<RequestDTO> {
        assert(dto.assignedTo == null)
        return if (dto.issuedBy.id == null)
            customerService.save(dto.issuedBy).flatMap { customerId -> assignFromCustomer(dto, customerId) }
        else
            assignFromCustomer(dto, dto.issuedBy.id)
    }

    fun attachEquity(equityId: Long, id: Int?): Mono<Long> {
        return if (id != null)
            requestRepository.attachEquity(equityId, id).map { if(it) equityId else throw IllegalArgumentException("Заявка не найдена") }
        else
            Mono.just(equityId)
    }

    fun delete(id: Int) = requestRepository.deleteById(id)

    fun findByPersons(issuedBy: Int?, assignedTo: Int?): Flux<RequestDTO> {
        return when {
            issuedBy != null -> requestRepository.findByIssuer(issuedBy).flatMap { collectRequestInfo(it) }
            assignedTo != null -> requestRepository.findByAssignee(assignedTo).flatMap { collectRequestInfo(it) }
            else -> Flux.empty()
        }
    }

    private fun assignFromCustomer(dto: RequestDTO, customerId: Int) =
            (if (dto.about?.responsible != null) Mono.just(dto.about.responsible)
            else agentService.selectAgent(dto))
                    .flatMap { agentId -> requestRepository.save(dto.toEntity(customerId, agentId)) }
                    .flatMap { collectRequestInfo(it) }

    private fun collectRequestInfo(req: Request) =
            if (req.about != null)
                Mono.zip(
                        equityService.findById(req.about),
                        customerService.findById(req.issuedBy),
                        agentService.findById(req.assignedTo)
                ).map { fromEntity(req, it.t1, it.t2, it.t3) }
            else
                Mono.zip(
                        customerService.findById(req.issuedBy),
                        agentService.findById(req.assignedTo)
                ).map { fromEntity(req, null, it.t1, it.t2) }
}