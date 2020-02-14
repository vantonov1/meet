import {getAuthToken} from "./FirebaseAPI";

export function fetchJSON(url, options) {
    let authToken = getAuthToken();
    if (authToken !== null)
        if (options)
            options.headers = {...options.headers, Authorization: 'Bearer ' + authToken};
        else options = {
            headers: {
                Authorization: 'Bearer ' + authToken
            }
        };
    return fetch(url, options).then(response => handleResponse(response));
}

export function fetchEmpty(url, options) {
    return fetch(url, options).then(response => {
        if (!response.ok) {
            throw new Error(response.status + ' ' + response.statusText);
        }
    });
}

function handleResponse(response) {
    if (response.ok) {
        return response.json().then(json => {
            return json;
        })
    } else {
        if ([401, 403].includes(response.status)) {
            return Promise.reject({message: response.status});
        } else
            response.json().then(json => {
                return Promise.reject(json)
            })
    }
}