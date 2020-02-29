import {fetchEmpty} from "./fetch";

const BASE = '/api/auth/v1/messaging';

export class MessagingAPI {
    static registerToken(personId, token) {
        let url = new URL(BASE);
        url.searchParams.append("personId", personId);
        url.searchParams.append("token", token);
        return fetchEmpty(url, {method: 'PUT'});
    }
}