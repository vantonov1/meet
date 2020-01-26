import {fetchJSON} from "./fetch";

export default class PhotoAPI {
    static BASE = 'http://localhost:8080/api/v1/photo';

    static upload(files) {
        const fd = new FormData();
        files.forEach(f => fd.append("files", f));
        return fetchJSON(this.BASE, {method: 'POST', body: fd})
    }

    static url(id) {
        return this.BASE + '?id=' + id
    }
}
