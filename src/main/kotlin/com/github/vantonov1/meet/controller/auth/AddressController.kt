package com.github.vantonov1.meet.controller.auth

import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate

const val BASE = "https://kladr-api.ru"
const val TOKEN = "GTN7zYb83YRDnRzB4R9Q5Bk3EZYZF85a"

val FIAS = mapOf(Pair(2, "7800000000000"))

@RestController
@RequestMapping("/api/auth/v1/address")
@CrossOrigin("*")
@Suppress("unused")
class AddressController {

    @GetMapping
    fun findStreets(@RequestParam query: String, @RequestParam city: Int): List<String> {
        val entity = RestTemplate().getForEntity("$BASE/api.php?query={query}&cityId={cityId}&token={token}&contentType=street&limit=10", KladrResponse::class.java, mapOf(
                Pair("query", query),
                Pair("cityId", FIAS[city]),
                Pair("token", TOKEN)
        ))
        return entity.body?.result?.filter { it.id != "Free" }?.map { a -> a.type.orEmpty() + ' ' + a.name} ?: listOf()
    }
}

data class KladrResponse(val result: List<KladrObject>)
data class KladrObject(val id: String, val name: String, val type: String?/*, val parents: List<KladrObject>?*/)