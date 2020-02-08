import {fetchJSON} from "./fetch";

export default class DirectoryAPI {
    static BASE = 'http://localhost:8080/api/public/v1/dir';

    static fetchDistricts(city) {
        return fetchJSON(this.BASE + "/districts/" + city)
    }
    static fetchSubways(city) {
        return fetchJSON(this.BASE + "/subways/" + city)
    }
}
