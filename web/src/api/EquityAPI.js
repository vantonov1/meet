export default class EquityAPI {
    static BASE = 'http://localhost:8080/api/v1/equities';

    static create(dto) {
        return fetch(this.BASE, {method: 'POST', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        }).then(r => r.json())
    }

    static update(dto) {
        return fetch(this.BASE, {method: 'PUT', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    static delete(id) {
        return fetch(this.BASE + "/" + id, {method: 'DELETE'})
    }

    static findById(id) {
        return fetch(this.BASE + "/" + id).then(r => r.json())
    }

    static findByIds(ids) {
        let url = new URL(this.BASE + "/ids");
        url.searchParams.append("ids", ids);
        return fetch(url).then(response => response.json())
    }

    static findLocations(filter) {
        let url = new URL(this.BASE);
        url.searchParams.append("type", filter.type);
        return fetch(url).then(response => response.json())
    }

}
