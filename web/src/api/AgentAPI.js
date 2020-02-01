import {fetchJSON} from "./fetch";

const BASE = 'http://localhost:8080/api/v1/agent';

export default class AgentAPI {
    static createAgent(dto) {
        return fetchJSON(BASE, {
            method: 'POST', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}