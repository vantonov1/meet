import {fetchJSON} from "./fetch";

export default class KladrAPI {
    static BASE = 'http://localhost:8080/api/v1/address';

    static fetchStreets(city, query) {
        if(query && query !== '') {
            let url = new URL(this.BASE);
            url.searchParams.append("query", query);
            url.searchParams.append("city", city);
            return fetchJSON(url)
        } else {
            return Promise.resolve([])
        }
    }
}
