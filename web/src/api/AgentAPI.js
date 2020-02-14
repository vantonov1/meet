import {fetchJSON} from "./fetch";

const BASE = 'http://localhost:8080/api/auth/v1/agent';

export default class AgentAPI {
    static loadAgents() {
        return fetchJSON(BASE)
    }

    static invite(email) {
        let url = new URL(BASE + "/invite");
        url.searchParams.append("email", email);
        return fetchJSON(url, {method: 'POST'})
    }

    static register(invitation, dto) {
        let url = new URL(BASE + '/register');
        url.searchParams.append("invitation", invitation);
        return fetchJSON(url, {method: 'PUT', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }})
    }

}