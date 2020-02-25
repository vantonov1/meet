import * as firebase from "firebase";

//const BASE = baseURL() + '/api/public/v1/photo';

const storage = firebase.storage();
const storageRef = storage.ref();
const imagesRef = storageRef.child('photo');

export default class PhotoAPI {

    static upload(files, progress) {
        return Promise.all(files.map(file => {
            let task = imagesRef.child(createUUID()).put(file, {contentType: 'image/jpeg'});
            task.on('state_changed', snapshot => {
                progress(snapshot.bytesTransferred * 100 / snapshot.totalBytes);
            });
            return task.then(snapshot => snapshot.ref.getDownloadURL())
        }));
    }

    /*
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
            });
        }
    */
    static url(id) {
        return /*BASE + '?id=' +*/ id
    }
}

function createUUID() {
    let dt = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

