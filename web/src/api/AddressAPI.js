import {fetchJSON} from "./fetch";

export default class AddressAPI {
    static BASE = '/api/auth/v1/address';

    static fetchStreets(city, query) {
        if (city && city !== 0 && query && query !== '') {
            let url = new URL(this.BASE);
            url.searchParams.append("query", query);
            url.searchParams.append("city", city);
            return fetchJSON(url)
        } else {
            return Promise.resolve([])
        }
    }
}
