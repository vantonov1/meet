import {fetchJSON} from "./fetch";

const BASE = 'http://localhost:8080/api/auth/v1/authorities';

export default class AuthAPI {
    static getAuthorities() {
        return fetchJSON(BASE, {method: 'POST'})
    }
}