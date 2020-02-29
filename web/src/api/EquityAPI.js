import {createURL, fetchEmpty, fetchJSON} from "./fetch";

export default class EquityAPI {
    static BASE = '/api/auth/v1/equities';

    static create(dto, fromRequest) {
        let url = createURL(this.BASE);
        if (fromRequest)
            url.searchParams.append("fromRequest", fromRequest);
        return fetchJSON(url, {
            method: 'POST', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    static update(dto) {
        return fetchEmpty(this.BASE, {
            method: 'PUT', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    static delete(id) {
        return fetchEmpty(this.BASE + "/" + id, {method: 'DELETE'})
    }
}
