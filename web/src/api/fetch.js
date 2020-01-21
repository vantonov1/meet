export function fetchJSON(url, options) {
    return fetch(url, options).then((response) => {
        if (!response.ok) {
            throw new Error(response.status + ' ' + response.statusText);
        }
        return response.json();
    });
}

export function fetchEmpty(url, options) {
    return fetch(url, options).then((response) => {
        if (!response.ok) {
            throw new Error(response.status + ' ' + response.statusText);
        }
    });
}