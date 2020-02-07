import {fetchEmpty, fetchJSON} from "./fetch";

const BASE = 'http://localhost:8080/api/v1/timeslots';

export default class TimeSlotAPI {
    static createTimeSlots(slots, requestId) {
        let url = new URL(BASE);
        url.searchParams.append("requestId", requestId);
        return fetchEmpty(url, {
            method: 'POST', body: JSON.stringify(slots), headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    static async loadTimeSlots(requestId) {
        let url = new URL(BASE);
        url.searchParams.append("requestId", requestId);
        return fetchJSON(url);
    }

    static async collectTimeTable(agentId, buyerId, sellerId) {
        let url = new URL(BASE + '/table');
        url.searchParams.append("agentId", agentId);
        url.searchParams.append("buyerId", buyerId);
        url.searchParams.append("sellerId", sellerId);
        return fetchJSON(url);
    }
}