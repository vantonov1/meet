package com.github.vantonov1.meet.service

import com.github.vantonov1.meet.entities.Photo
import com.github.vantonov1.meet.repository.PhotoRepository
import org.springframework.stereotype.Service

@Service
class PhotoService(private val repository: PhotoRepository) {
    fun findAllByEquityId(ids: List<Long>): Map<Long, MutableList<Photo>> {
        val result = mutableMapOf<Long, MutableList<Photo>>()
        repository.findAllByOf(ids).forEach{result.getOrPut(it.of, {mutableListOf()}).add(it)}
        return result;
    }

//    fun upload(files: Flux<FilePart>) = files.flatMap<String> { storage.save(it) }.collectList()

    fun download(name: String) = name//storage.get(name)

    fun save(equityId: Long, ids: Collection<String>?) {
        if (!ids.isNullOrEmpty()) {
            repository.saveAll(ids.map { Photo(it, equityId) })
        }
    }
}