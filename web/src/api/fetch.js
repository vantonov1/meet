import {getAuthToken} from "./FirebaseAPI";

export function fetchJSON(url, options) {
    return fetch(url, setAuth(options)).then(response => handleResponse(response));
}

export function fetchEmpty(url, options) {
    return fetch(url, setAuth(options)).then(response => {
        if (!response.ok) {
            return handleError(response);
        }
    });
}

function setAuth(options) {
    let authToken = getAuthToken();
    if (authToken !== null)
        if (options)
            options.headers = {...options.headers, Authorization: 'Bearer ' + authToken};
        else options = {
            headers: {
                Authorization: 'Bearer ' + authToken
            }
        };
    return options;
}

function handleResponse(response) {
    if (response.ok) {
        return response.json().then(json => {
            return json;
        })
    } else {
        return handleError(response);
    }
}

function handleError(response) {
    if ([401, 403].includes(response.status)) {
        return Promise.reject({message: response.status});
    } else
        response.json().then(json => {
            return Promise.reject(json)
        })
}

