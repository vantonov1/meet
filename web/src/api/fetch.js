import {getAuthToken} from "./FirebaseAPI";

export function createURL(url) {
    return new URL(url, window.location.origin)
}

export async function fetchJSON(url, options) {
    let optionsWithAuth = await setOptions(options);
    const response = await fetch(url, optionsWithAuth);
    if (response.ok) {
        return await response.json()
    } else {
        return await handleError(response);
    }
}

export async function fetchEmpty(url, options) {
    let optionsWithAuth = await setOptions(options);
    const response = await fetch(url, optionsWithAuth);
    if (!response.ok) {
        await handleError(response);
    }
}

async function setOptions(options) {
    let authToken = await getAuthToken();
    if (authToken !== null) {
        if (options)
            options.headers = {
                ...options.headers,
                Authorization: 'Bearer ' + authToken,
                Accept: 'application/json'
            };
        else options = {
            headers: {
                Authorization: 'Bearer ' + authToken,
                Accept: 'application/json'
            }
        };
    } else {
        if (options)
            options.headers = {
                ...options.headers,
                Accept: 'application/json'
            };
        else options = {
            headers: {
                Accept: 'application/json'
            }
        };
    }
    return options;
}

async function handleError(response) {
    if ([401, 403].includes(response.status)) {
        return Promise.reject({message: response.status});
    } else {
        return Promise.reject(await response.json())
    }
}

