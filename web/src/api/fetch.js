import {getAuthToken} from "./FirebaseAPI";

export function baseURL() {
    return 'http://localhost:8080'
}

export async function fetchJSON(url, options) {
    let optionsWithAuth = await setAuth(options);
    const response = await fetch(url, optionsWithAuth);
    if (response.ok) {
        return await response.json()
    } else {
        return await handleError(response);
    }
}

export async function fetchEmpty(url, options) {
    let optionsWithAuth = await setAuth(options);
    const response = await fetch(url, optionsWithAuth);
    if (!response.ok) {
        await handleError(response);
    }
}

async function setAuth(options) {
    let authToken = await getAuthToken();
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

async function handleError(response) {
    if ([401, 403].includes(response.status)) {
        return Promise.reject({message: response.status});
    } else {
        return Promise.reject(await response.json())
    }
}

