package com.github.vantonov1.meet.controller

import com.github.vantonov1.meet.dto.AgentDTO
import com.github.vantonov1.meet.service.AgentService
import org.springframework.http.HttpStatus
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/agent")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class AgentController(private val agentService: AgentService) {
    @PostMapping
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody dto: AgentDTO) = agentService.save(dto)

    @PutMapping
    @Transactional
    fun update(@RequestBody dto: AgentDTO) = agentService.save(dto).then()

    @PutMapping("/active/{id}")
    @Transactional
    fun update(@PathVariable id: Int, @RequestParam active: Boolean) = agentService.setActive(id, active)

    @DeleteMapping("/{id}")
    @Transactional
    fun delete(id: Int) = agentService.delete(id)

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    fun findById(id: Int) = agentService.findById(id)
}