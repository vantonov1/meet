import {createURL, fetchJSON} from "./fetch";

const BASE = '/api/auth/v1/admin';

export default class AdminAPI {
    static loadAdmin() {
        return fetchJSON(BASE)
    }

    static invite(email) {
        let url = createURL(BASE + "/invite");
        url.searchParams.append("email", email);
        url.searchParams.append("base", window.location.origin + window.location.hash + '/registration?invitation=');
        return fetchJSON(url, {method: 'POST'})
    }

    static register(invitation) {
        let url = createURL(BASE);
        url.searchParams.append("invitation", invitation);
        return fetchJSON(url, {method: 'PUT'})
    }
}