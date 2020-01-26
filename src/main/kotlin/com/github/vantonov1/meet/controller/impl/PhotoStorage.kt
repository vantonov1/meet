package com.github.vantonov1.meet.controller.impl

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.core.io.ByteArrayResource
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.Resource
import org.springframework.http.codec.multipart.FilePart
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono
import java.io.File
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.util.*
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap


interface PhotoStorage {
    fun save(part: FilePart): Mono<String>
    fun get(id: String): Mono<Resource>
    fun getName(name: String): String
}

@Component("localFilePhotoStorage")
@Suppress("unused")
@ConditionalOnProperty("data.dir")
class LocalFilePhotoStorage : PhotoStorage {
    @Value("\${data.dir}")
    lateinit var contentRoot: String

    override fun save(part: FilePart): Mono<String> {
        val base = getBasePath()
        val dir: Path = Paths.get(contentRoot, base)
        val name: String = UUID.randomUUID().toString() + "_" + part.filename()
        try {
            part.transferTo(Paths.get(dir.toString(), name))
        } catch (ignored: NoSuchFileException) {
            Files.createDirectories(dir)
            part.transferTo(Paths.get(dir.toString(), name))
        }
        return Mono.just(Paths.get(base, name).toString())

    }

    override fun get(id: String): Mono<Resource> =
            if (!id.contains("..")) Mono.just(FileSystemResource(Paths.get(contentRoot, id)))
            else throw IllegalArgumentException("relative photo id")


    override fun getName(name: String): String {
        val sep = name.indexOf('_')
        return if (sep != -1) name.substring(sep) else throw IllegalStateException("wrong photo id")
    }

    private fun getBasePath(): String {
        val calendar = GregorianCalendar()
        return calendar[Calendar.YEAR].toString() + File.separator + (1 + calendar[Calendar.MONTH]) + File.separator + calendar[Calendar.DAY_OF_MONTH]
    }
}

@Component
@ConditionalOnMissingBean(LocalFilePhotoStorage::class)
@Suppress("unused")
class MemoryPhotoStorage : PhotoStorage {
    private val contents: MutableMap<String, MutableList<ByteArray>> = ConcurrentHashMap()

    override fun save(part: FilePart): Mono<String> {
        val id: String = UUID.randomUUID().toString() + "_" + part.filename()
        val buffers = mutableListOf<ByteArray>()
        contents[id] = buffers
        return part.content().map { buf ->
            buffers.add(buf.asInputStream().readBytes())
        }.then(Mono.just(id))
    }

    override fun get(id: String): Mono<Resource> {
        val content = contents[id]
        return if (content != null)
            Mono.just(ByteArrayResource(content.reduce { acc, bytes -> acc.plus(bytes) }))
        else
            throw java.lang.IllegalArgumentException("content not found, id=$id")
    }

    override fun getName(name: String): String {
        val sep = name.indexOf('_')
        return if (sep != -1) name.substring(sep) else throw IllegalStateException("wrong photo id")
    }
}
