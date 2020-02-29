import {createURL, fetchJSON} from "./fetch";

const BASE = '/api/public/v1/request';

export default class RequestPublicAPI {
    static createRequest(dto) {
        return fetchJSON(BASE, {
            method: 'POST', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    static saveRequestFromKnownCustomer(dto, customerId) {
        let url = createURL(BASE);
        url.searchParams.append("customerId", customerId);
        return fetchJSON(url, {
            method: 'POST', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}