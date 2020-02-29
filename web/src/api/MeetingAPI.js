import {createURL, fetchEmpty, fetchJSON} from "./fetch";

const BASE = '/api/auth/v1/meeting';

export default class RequestAPI {
    static createMeeting(dto) {
        return fetchJSON(BASE, {
            method: 'POST', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    static findMeetings(customer, agent, dateMin, dateMax) {
        let url = createURL(BASE);
        if (customer)
            url.searchParams.append("attends", customer);
        if (agent)
            url.searchParams.append("scheduledBy", agent);
        url.searchParams.append("dateMin", dateMin);
        url.searchParams.append("dateMax", dateMax);
        return fetchJSON(url)
    }

    static rescheduleMeeting(id, time) {
        let url = createURL(BASE + '/' + id);
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