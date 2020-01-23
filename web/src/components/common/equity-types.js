export const TYPES = {
    RENT_ROOM: "Аренда комнат",
    RENT_FLAT: "Аренда квартир",
    RENT_BUSINESS: "Аренда коммерческих помещений",
    SALE_ROOM: "Продажа комнат",
    SALE_FLAT: "Продажа квартир",
    SALE_BUSINESS: "Продажа коммерческих помещений"
};

export function typeByName(name) {
    for(let t in TYPES) {
        if(TYPES[t] === name) {
            return t;
        }
    }
}

export function nameByType(type) {
    return TYPES[type]
}