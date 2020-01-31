export const CITY = {
    1: 'Москва',
    2: 'Санкт-Петербург'
};

export const LIMITS = {
    square: {
        min: 10,
        max: 10000
    },
    price: {
        min: 100000,
        max: 100000000
    }
};

export const CONTACT_TYPES = {
    PHONE: {label: 'Телефон', type: 'tel'},
    MAIL: {label: 'Почта', type: 'email'},
    SKYPE: {label: 'Скайп', type: 'text'},
    TELEGRAM: {label: 'Телеграм', type: 'tel'},
    VIBER: {label: 'Вайбер', type: 'tel'},
    WHATSAPP: {label: 'Вацап', type: 'tel'},
    VK: {label: 'ВКонтакте', type: 'text'},
    FACEBOOK: {label: 'Фейсбук', type: 'text'},
};

export const EQUITY_TYPES = {
    RENT_ROOM: "Аренда комнат",
    RENT_FLAT: "Аренда квартир",
    RENT_BUSINESS: "Аренда коммерческих помещений",
    SALE_ROOM: "Продажа комнат",
    SALE_FLAT: "Продажа квартир",
    SALE_BUSINESS: "Продажа коммерческих помещений"
};

export const REQUEST_TYPE = {
    SELL: 'Продажа/сдача в аренду',
    BUY: 'Покупка/аренда'
};