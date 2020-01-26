package com.github.vantonov1.meet.service

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.github.vantonov1.meet.dto.fromEntity
import com.github.vantonov1.meet.entities.Equity
import com.github.vantonov1.meet.entities.EquityType
import org.junit.Ignore
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner
import java.io.File
import kotlin.random.Random

@RunWith(SpringRunner::class)
@SpringBootTest
class EquityServiceTest {

    @Autowired
    lateinit var equityService: EquityService

    @Autowired
    lateinit var districtService: DistrictService

    @Test
    fun testCRUD() {
        val equity = Equity(null, 1, 1,
                2, 1, null, null, null, 0.0, 0.0, 100500, null, 1, "test", null)
        val id = equityService.save(fromEntity(equity, null, null, listOf("1_1.jpg", "2_2.jpg"))).block()
        assert(id != null)
        val retrieved = equityService.findById(id!!).block()
        assert(retrieved != null && retrieved.id!! == id && retrieved.info == "test")
        assert(retrieved?.photos != null && retrieved.photos!!.containsAll(listOf("1_1.jpg", "2_2.jpg")))

        equityService.save(fromEntity(equity.copy(id = id, info = "updated"), null, null, null)).block()
        val updated = equityService.findById(id).block()
        assert(updated != null && updated.id!! == id && updated.info == "updated")

        equityService.delete(id, true).block()
        val hidden = equityService.findById(id).block()
        assert(hidden == null)
    }

    @Test
    @Ignore
    fun testLoad() {
        val RENT_FLAT = EquityType.RENT_FLAT.value
        val mapper = jacksonObjectMapper()
        val ref = object : TypeReference<List<Facility>>() {}
        val facilities = mapper.readValue(javaClass.getResource("/f.json"), ref)
        val equities: MutableList<Equity> = ArrayList(10000)
        facilities.forEach { f ->
            if (!f.locations.isNullOrEmpty()) {
                f.addresses.forEach { a ->
                    val rooms = Random.nextInt(4) + 1
                    val d = districtService.findByName(a.district)
                    equities += Equity(null, RENT_FLAT, 0, 2, d?.id, null, a.street + ' ' + a.streetType, a.house,
                                f.locations[0].location.coordinates[1], f.locations[0].location.coordinates[0],
                                rooms * 2_000_000, rooms * 25, rooms.toByte(), "Тестовая загрузка", null)
                }
            }
        }
        mapper.writeValue(File(System.getProperty("java.io.tmpdir") + "\\ff.json"), equities)

//        {"nativeId":"0000009207",
//            "facility":{"address":"г. Санкт-Петербург, Ириновский пр.,  - Наставников пр."},
//            "addresses":[
//            {"addressId":"305868480775910","fiasAddress":"г. Санкт-Петербург, пр-кт. Ириновский, д. 31/48","postal":"195279","district":"Красногвардейский","roomNumber":" ","region":"Санкт-Петербург","street":"Ириновский","streetType":"пр-кт","house":"31/48",
//                "locations":[
//                {"nativeId":"0000009207","location":{"type":"Point","coordinates":[30.4764162667084,59.9578139]}
//                }
//                ]
//            }


    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class Facility(
        val addresses: List<Address>,
        val locations: List<Location>?
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class Address(
        val addressId: String,
        val region: String,
        val district: String,
        val street: String,
        val streetType: String,
        val house: String?
        )

@JsonIgnoreProperties(ignoreUnknown = true)
data class Location(
        val location: GeoPoint
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class GeoPoint(
        val coordinates: List<Double>
)