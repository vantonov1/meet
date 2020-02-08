const BASE = 'http://localhost:8080/api/public/v1/photo';

export default class PhotoAPI {
    static upload(files, progress) {
        const fd = new FormData();
        files.forEach(f => fd.append("files", f));
        // return fetchJSON(this.BASE, {method: 'POST', body: fd})
        const request = new XMLHttpRequest();
        request.responseType = 'json';
        return new Promise(function (resolve, reject) {
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status >= 200 && request.status < 300) {
                        resolve(request.response);
                    } else {
                        reject({
                            message: request.status + ' ' + request.statusText
                        });
                    }
                }

            };
            request.open("POST", BASE);
            request.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = e.loaded / e.total * 100;
                    progress(percentComplete)
                }
            });
            request.send(fd);
        });}

    static url(id) {
        return BASE + '?id=' + id
    }
}

