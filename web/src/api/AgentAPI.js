import {createURL, fetchJSON} from "./fetch";

const BASE = '/api/auth/v1/agent';

export default class AgentAPI {
    static loadAgents() {
        return fetchJSON(BASE)
    }

    static loadAgent(id) {
        return fetchJSON(BASE + '/' + id)
    }

    static invite(email) {
        let url = createURL(BASE + "/invite");
        url.searchParams.append("email", email);
        url.searchParams.append("base", window.location.origin + '/#/registration/agent?invitation=');
        return fetchJSON(url, {method: 'POST'})
    }

    static register(invitation, dto) {
        let url = createURL(BASE + '/register');
        url.searchParams.append("invitation", invitation);
        return fetchJSON(url, {
            method: 'PUT', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    static setActive(agentId, active) {
        let url = createURL(BASE + '/active/' + agentId);
        url.searchParams.append("active", active);
        return fetchJSON(url, {method: 'PUT'})
    }

}