import {createSlice} from "@reduxjs/toolkit";
import {show} from "../show-error/slice"
import DirectoryAPI from "../../api/DirectoryAPI";
import KladrAPI from "../../api/KladrAPI";
import EquityAPI from "../../api/EquityAPI";
import PhotoAPI from "../../api/PhotoAPI";
import {clearSelectedFiles, getSelectedFiles} from "../common/photo-upload";

const LIMITS = {
    square: {
        min: 10,
        max: 10000
    },
    price: {
        min: 100000,
        max: 100000000
    }
};

const slice = createSlice({
    name: 'add-equity',
    initialState: {
        showDialog: false,
        equity: {
            type: 0,
            address: {
                city: 0,
                district: {
                    id: 0,
                    name: ''
                },
                subway: {
                    id: 0,
                    name: ''
                },
                street: '',
                building: ''
            },
            price: '',
            square: '',
            rooms: '',
            info: ''
        },
        selectedPhotos: [],
        districts: [],
        subways: [],
        streets: [],
        streetText: '',
        validation: {
            street: {
                error: false,
                text: ''
            },
            square: {
                error: false,
                text: '',
                min: 10,
                max: 10000
            },
            price: {
                error: false,
                text: '',
                min: 100000,
                max: 100000000
            }
        },
    },
    reducers: {
        toggleDialog: (state, {payload}) => {
            state.showDialog = payload;
            clearSelectedFiles()
        },
        setEquity: (state, {payload}) => {
            state.equity = payload
        },
        setAddress: (state, {payload}) => {
            state.equity.address = payload
        },
        setDistricts: (state, {payload}) => {
            state.districts = payload
        },
        setSubways: (state, {payload}) => {
            state.subways = payload
        },
        setStreets: (state, {payload}) => {
            state.streets = payload
        },
        setStreetText: (state, {payload}) => {
            if (state.streetText !== payload) {
                state.streets = [];
                state.streetText = payload
            }
        },
        setValidation: (state, {payload}) => {
            state.validation = payload
        },
        addPhoto: (state, {payload}) => {
            state.selectedPhotos = [...state.selectedPhotos, payload]
        },
    }
});

export default slice.reducer
export const {toggleDialog, setEquity, setAddress, setStreetText, addPhoto} = slice.actions;

function validate(equity) {
    let result = {};
    if (!equity.type) {
        result.type = {error: true, text: "Обязательное поле"}
    }
    if (!equity.address.street) {
        result.street = {error: true, text: "Обязательное поле"}
    }
    if (!equity.price) {
        result.price = {error: true, text: "Обязательное поле"}
    } else if (equity.price < LIMITS.price.min || equity.price > LIMITS.price.max) {
        result.price = {error: true, text: "Недопустимое значение"}
    }
    if (!equity.square) {
        result.square = {error: true, text: "Обязательное поле"}
    } else if (equity.square < LIMITS.square.min || equity.square > LIMITS.square.max) {
        result.square = {error: true, text: "Недопустимое значение"}
    }
    return result;
}

export const saveEquity = (equity) => async dispatch => {
    const {toggleDialog, setValidation} = slice.actions;
    try {
        let errors = validate(equity);
        if (Object.entries(errors).length === 0) {
            let unfreeze = {...equity};
            let selectedFiles = getSelectedFiles();
            if (selectedFiles.length !== 0) {
                unfreeze.photos = await PhotoAPI.upload(selectedFiles)
            }
            await EquityAPI.create(unfreeze);
            dispatch(toggleDialog(false))
        } else
            dispatch(setValidation(errors))
    } catch (reason) {
        dispatch(show(reason.message))
    }
};

export const loadDistricts = (city) => async (dispatch) => {
    const {setDistricts} = slice.actions;
    try {
        dispatch(setDistricts(await DirectoryAPI.fetchDistricts(city)))
    } catch (reason) {
        dispatch(show(reason.message))
    }
};

export const loadSubways = (city) => async (dispatch) => {
    const {setSubways} = slice.actions;
    try {
        dispatch(setSubways(await DirectoryAPI.fetchSubways(city)))
    } catch (reason) {
        dispatch(show(reason.message))
    }
};

export const fetchStreets = (city, query) => async (dispatch, getState) => {
    const {setStreets} = slice.actions;
    try {
        let streets = await KladrAPI.fetchStreets(city, query);
        const {streetText} = getState().addEquity;
        if (query === streetText)
            dispatch(setStreets(streets))
    } catch (reason) {
        dispatch(show(reason.message))
    }
};