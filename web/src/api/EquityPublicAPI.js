import {fetchJSON} from "./fetch";

export default class EquityPublicAPI {
    static BASE = '/api/public/v1/equities';

    static findByIds(ids) {
        let url = new URL(this.BASE + "/ids");
        url.searchParams.append("ids", ids);
        return fetchJSON(url)
    }

    static findById(id) {
        return fetchJSON(this.BASE + '/' + id)
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

    static async findEquitiesByAddress(type, city, street, building) {
        let url = new URL(this.BASE + "/address");
        url.searchParams.append("type", type);
        url.searchParams.append("city", city);
        url.searchParams.append("street", street);
        url.searchParams.append("building", building);
        return fetchJSON(url)
    }
}
