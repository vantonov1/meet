import {fetchJSON} from "./fetch";

const BASE = 'http://localhost:8080/api/v1/request';

export default class RequestAPI {
    static createRequest(dto) {
        return fetchJSON(BASE, {
            method: 'POST', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}