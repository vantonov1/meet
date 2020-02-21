package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.entities.Photo
import com.github.vantonov1.meet.repository.PhotoRepository
import com.github.vantonov1.meet.service.impl.PhotoStorage
import org.springframework.http.codec.multipart.FilePart
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class PhotoService(private val repository: PhotoRepository, private val storage: PhotoStorage) {
    fun findByEquityId(of: Long) = repository.findByOf(of).map { it.id }.collectList()

    fun findAllByEquityId(ids: List<Long>) = repository.findAllByOf(ids).collectMultimap(Photo::of)

    fun upload(files: Flux<FilePart>) = files.flatMap<String> { storage.save(it) }.collectList()

    fun download(name: String) = name//storage.get(name)

    fun save(equityId: Long, ids: Collection<String>?) = if (!ids.isNullOrEmpty()) {
        val photos = ids.map { Photo(it, equityId) }
        repository.saveAll(Flux.fromIterable(photos)).then(Mono.just(equityId))
    } else
        Mono.just(equityId)
}