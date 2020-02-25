import {baseURL, fetchEmpty} from "./fetch";

const BASE = baseURL() + '/api/auth/v1/comment';

export default class CommentAPI {
    static createComment(dto) {
        return fetchEmpty(BASE, {
            method: 'POST',
            body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        })
    }


}