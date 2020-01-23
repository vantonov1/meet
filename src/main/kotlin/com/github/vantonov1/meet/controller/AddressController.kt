package com.github.vantonov1.meet.controller

import org.springframework.web.bind.annotation.*
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono

const val BASE = "https://kladr-api.ru"
const val TOKEN = "GTN7zYb83YRDnRzB4R9Q5Bk3EZYZF85a"

val FIAS = mapOf(Pair(2, "7800000000000"))

@RestController
@RequestMapping("/api/v1/address")
@CrossOrigin("http://localhost:3000")
@Suppress("unused")
class AddressController {
    @GetMapping
    fun findStreets(@RequestParam query: String, @RequestParam city: Int): Mono<List<String>> {
        val uri = WebClient.create(BASE).get().uri { b ->
            b.path("/api.php")
                    .queryParam("query", query)
                    .queryParam("cityId", FIAS[city])
                    .queryParam("limit", "10")
                    .queryParam("contentType", "street")
                    .queryParam("token", TOKEN)
//                    .queryParam("withParent", 1)
                    .build()
        }
        return uri.retrieve().bodyToMono(KladrResponse::class.java).map { it.result }.map { it.filter { it.id != "Free" }.map { a -> a.type.orEmpty() + ' ' + a.name} }
    }
}

data class KladrResponse(val result: List<KladrObject>)
data class KladrObject(val id: String, val name: String, val type: String?/*, val parents: List<KladrObject>?*/)