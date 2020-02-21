import {fetchJSON} from "./fetch";

const BASE='https://nominatim.openstreetmap.org';

export function geocode(city, street, building) {
    let url = new URL(BASE + '/search');
    url.searchParams.append("format", "jsonv2");
    url.searchParams.append("countrycodes", "ru");
    url.searchParams.append("city", city);
    url.searchParams.append("street", building + ' ' + street);
    return fetchJSON(url)
}

export function reverseGeocode(lon, lat) {
    let url = new URL(BASE + '/reverse');
    url.searchParams.append("format", "jsonv2");
    url.searchParams.append("lat", lat);
    url.searchParams.append("lon", lon);
    return fetchJSON(url)

}