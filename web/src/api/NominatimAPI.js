import {fetchJSON} from "./fetch";

const BASE='https://nominatim.openstreetmap.org/search';

export function geocode(city, street, building) {
    let url = new URL(BASE);
    url.searchParams.append("format", "json");
    url.searchParams.append("countrycodes", "ru");
    url.searchParams.append("city", city);
    url.searchParams.append("street", building + ' ' + street);
    return fetchJSON(url)
}