import {getAuthToken} from "./FirebaseAPI";

export async function fetchJSON(url, options) {
    const response = await fetch(url, setAuth(options));
    if (response.ok) {
        return await response.json()
    } else {
        return await handleError(response);
    }
}

export async function fetchEmpty(url, options) {
    const response = await fetch(url, setAuth(options));
    if (!response.ok) {
        await handleError(response);
    }
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

async function handleError(response) {
    if ([401, 403].includes(response.status)) {
        return Promise.reject({message: response.status});
    } else {
        return Promise.reject(await response.json())
    }
}

