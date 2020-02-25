import {baseURL, fetchJSON} from "./fetch";

const BASE = baseURL() + '/api/auth/v1/admin';

export default class AdminAPI {
    static loadAdmin() {
        return fetchJSON(BASE)
    }

    static invite(email) {
        let url = new URL(BASE + "/invite");
        url.searchParams.append("email", email);
        url.searchParams.append("base", window.location.origin + window.location.pathname + '/registration?invitation=');
        return fetchJSON(url, {method: 'POST'})
    }

    static register(invitation) {
        let url = new URL(BASE);
        url.searchParams.append("invitation", invitation);
        return fetchJSON(url, {method: 'PUT'})
    }
}