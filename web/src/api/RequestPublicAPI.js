import {createURL, fetchJSON} from "./fetch";

const BASE = '/api/public/v1/request';

export default class RequestPublicAPI {
    static createRequest(dto, customerId) {
        let url = createURL(BASE);
        if (customerId)
            url.searchParams.append("customerId", customerId);
        return fetchJSON(url, {
            method: 'POST', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}