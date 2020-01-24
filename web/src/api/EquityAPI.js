import {fetchEmpty, fetchJSON} from "./fetch";

export default class EquityAPI {
    static BASE = 'http://localhost:8080/api/v1/equities';

    static create(dto) {
        return fetchJSON(this.BASE, {
            method: 'POST', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    static update(dto) {
        return fetchEmpty(this.BASE, {
            method: 'PUT', body: JSON.stringify(dto), headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    static delete(id) {
        return fetchEmpty(this.BASE + "/" + id, {method: 'DELETE'})
    }

    static findById(id) {
        return fetchJSON(this.BASE + "/" + id)
    }

    static findByIds(ids) {
        let url = new URL(this.BASE + "/ids");
        url.searchParams.append("ids", ids);
        return fetchJSON(url)
    }

    static findLocations(filter) {
        let url = this.createFilterURL('', filter);
        if (filter.minPrice !== null) {
            url.searchParams.append("minPrice", filter.minPrice);
        }
        if (filter.maxPrice !== null) {
            url.searchParams.append("maxPrice", filter.maxPrice);
        }
        return fetchJSON(url)
    }
    static getPriceRange(filter) {
        let url = this.createFilterURL('/prices', filter);
        return fetchJSON(url)
    }

    static createFilterURL(path, filter) {
        let url = new URL(this.BASE + path);
        url.searchParams.append("type", filter.type);
        url.searchParams.append("city", filter.city);
        if (filter.district.length !== 0) {
            url.searchParams.append("district", filter.district);
        }
        if (filter.subway.length !== 0) {
            url.searchParams.append("subway", filter.subway);
        }
        return url;
    }
}
