import {createURL, fetchEmpty} from "./fetch";

const BASE = '/api/auth/v1/messaging';

export class MessagingAPI {
    static registerToken(personId, token) {
        let url = createURL(BASE);
        url.searchParams.append("personId", personId);
        url.searchParams.append("token", token);
        return fetchEmpty(url, {method: 'PUT'});
    }
}