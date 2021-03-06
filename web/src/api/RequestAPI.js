import {baseURL, fetchEmpty, fetchJSON} from "./fetch";

const BASE = baseURL() + '/api/auth/v1/request';

export default class RequestAPI {
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

    static completeRequest(sellId, buyId, equityId, contractNumber) {
        let url = new URL(BASE+ '/complete');
        url.searchParams.append("sellId", sellId);
        url.searchParams.append("buyId", buyId);
        url.searchParams.append("equityId", equityId);
        url.searchParams.append("contractNumber", contractNumber);
        return fetchEmpty(url, {method: 'PUT'})
    }
}