export function fetchJSON(url, options) {
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
    return response.json().then(json => {
        if (response.ok) {
            return json;
        } else {
            return Promise.reject(json)
        }
    })
}