import {fetchJSON} from "./fetch";

const BASE = 'http://localhost:8080/api/public/v1/request';

export default class RequestPublicAPI {
    static createRequest(dto) {
        return fetchJSON(BASE, {
            method: 'POST', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    static saveRequestFromKnownCustomer(dto, customerId) {
        let url = new URL(BASE);
        url.searchParams.append("customerId", customerId);
        return fetchJSON(url, {
            method: 'POST', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}