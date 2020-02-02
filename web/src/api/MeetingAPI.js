import {fetchEmpty, fetchJSON} from "./fetch";

const BASE = 'http://localhost:8080/api/v1/meeting';

export default class RequestAPI {
    static createMeeting(dto) {
        return fetchJSON(BASE, {
            method: 'POST', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    static findMeetings(customer, agent) {
        let url = new URL(BASE);
        if (customer)
            url.searchParams.append("attends", customer);
        if (agent)
            url.searchParams.append("scheduledBy", agent);
        return fetchJSON(url)
    }

    static rescheduleMeeting(id, time) {
        let url = new URL(BASE + '/' + id);
        url.searchParams.append("schedule", time);
        return fetchEmpty(url, {
            method: 'PUT'
        })
    }

    static deleteMeeting(id) {
        return fetchEmpty(BASE + '/' + id, {
            method: 'DELETE'
        })
    }
}