package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.controler.impl.PhotoStorage
import com.github.vantonov1.meet.entities.Photo
import com.github.vantonov1.meet.repository.PhotoRepository
import org.springframework.core.io.Resource
import org.springframework.http.CacheControl
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.http.codec.multipart.FilePart
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.util.concurrent.TimeUnit

@Service
class PhotoService(private val repository: PhotoRepository, private val storage: PhotoStorage) {
    fun findByEquityId(of: Long): Mono<List<String>> {
        return repository.findByOf(of).map { it.id }.collectList()
    }

    fun upload(files: Flux<FilePart>): Mono<List<String>> {
        return files.flatMap<String> { storage.save(it) }.collectList()
    }

    fun download(name: String): Mono<ResponseEntity<Resource>> {
        return storage.get(name).map {
            ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"${storage.getName(name)}\"")
                    .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).noTransform().cachePublic())
                    .body(it)
        }
    }

    fun save(equityId: Long, photos: List<String>?) {
        if(photos != null) {
            repository.saveAll(Flux.fromStream(photos.stream().map { Photo(it, equityId) }))
        }
    }
}