import {baseURL, fetchJSON} from "./fetch";

export default class DirectoryAPI {
    static BASE = baseURL() + '/api/public/v1/dir';

    static fetchDistricts(city) {
        return fetchJSON(this.BASE + "/districts/" + city)
    }
    static fetchSubways(city) {
        return fetchJSON(this.BASE + "/subways/" + city)
    }
}
