package com.github.vantonov1.meet.controler

import com.github.vantonov1.meet.service.PhotoService
import org.springframework.core.io.Resource
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.codec.multipart.FilePart
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono


@RestController
@RequestMapping("/api/v1/photo")
@Suppress("unused")
class PhotoController(val service: PhotoService) {
    @PostMapping
    fun upload(@RequestPart("files") files: Flux<FilePart>): Mono<List<String>> = service.upload(files)

    @GetMapping(produces = [MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE])
    fun download(@PathVariable name: String): Mono<ResponseEntity<Resource>> = service.download(name)
 }