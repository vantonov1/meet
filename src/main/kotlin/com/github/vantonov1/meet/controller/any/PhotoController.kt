package com.github.vantonov1.meet.controller.any

import com.github.vantonov1.meet.service.PhotoService
import org.springframework.http.CacheControl
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.codec.multipart.FilePart
import org.springframework.http.codec.multipart.Part
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import java.util.concurrent.TimeUnit


@RestController
@RequestMapping("/api/public/v1/photo")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class PhotoController(val service: PhotoService) {
    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun upload(@RequestBody files: Flux<Part>) = service.upload(files.filter{it is FilePart}.map { it as FilePart })

    @GetMapping(produces = [MediaType.IMAGE_JPEG_VALUE])
    fun download(@RequestParam id: String) =  service.download(id).map { ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment")
            .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).noTransform().cachePublic())
            .body(it) }
 }