export default class DirectoryAPI {
    static BASE = 'http://localhost:8080/api/v1/dir';

    static fetchDistricts(city) {
        return fetch(this.BASE + "/districts/" + city).then(r => r.json())
    }
    static fetchSubways(city) {
        return fetch(this.BASE + "/subway/" + city).then(r => r.json())
    }
}
