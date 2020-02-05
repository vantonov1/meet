import {fetchEmpty, fetchJSON} from "./fetch";

const BASE = 'http://localhost:8080/api/v1/request';

export default class RequestAPI {
    static createRequest(dto) {
        return fetchJSON(BASE, {
            method: 'POST', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    static findRequests(customer, agent) {
        let url = new URL(BASE);
        if (customer)
            url.searchParams.append("issuedBy", customer);
        if (agent)
            url.searchParams.append("assignedTo", agent);
        return fetchJSON(url)
    }

    static deleteRequest(id) {
        return fetchEmpty(BASE + '/' + id, {method: 'DELETE'})
    }

    static changeRequestEquity(id, equityId) {
        let url = new URL(BASE+ '/' + id);
        url.searchParams.append("equityId", equityId);
        return fetchEmpty(url, {method: 'PUT'})
    }
}