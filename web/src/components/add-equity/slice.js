import {createSlice} from "@reduxjs/toolkit";
import {show} from "../show-error/slice"
import DirectoryAPI from "../../api/DirectoryAPI";
import KladrAPI from "../../api/KladrAPI";
import EquityAPI from "../../api/EquityAPI";
import PhotoAPI from "../../api/PhotoAPI";
import {clearSelectedFiles, getSelectedFiles} from "../common/photo-upload";
import {geocode} from "../../api/NominatimAPI";
import {CITY, LIMITS} from "../common/constants";

function createInitialState() {
    return {
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
                building: '',
                lat: null,
                lon: null
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
            },
            price: {
                error: false,
                text: '',
            },
            building: {
                error: false,
                text: '',
            }
        },
        save: {
            uploadingFiles: false,
            uploadingFilesProgress: 0,
            creatingEquity: false
        }
    }
}

const slice = createSlice({
    name: 'add-equity',
    initialState: createInitialState(),
    reducers: {
        toggleDialog: (state, {payload}) => {
            let initial = createInitialState();
            state.equity = initial.equity;
            state.selectedPhotos = [];
            state.streets = [];
            state.streetText = '';
            state.validation = initial.validation;
            state.save = initial.save;
            state.showDialog = payload;
            clearSelectedFiles();
        },
        setField: (state, {payload}) => {
            state[payload.name] = payload.value
        },
        setEquityField: (state, {payload}) => {
            state.equity[payload.name] = payload.value
        },
        addPhoto: (state, {payload}) => {
            state.selectedPhotos = [...state.selectedPhotos, payload]
        },
    }
});

export default slice.reducer
export const {toggleDialog, setField, setEquityField, addPhoto} = slice.actions;

function validate(equity) {
    let result = {};
    if (!equity.type) {
        result.type = {error: true, text: "Обязательное поле"}
    }
    if (!equity.address.street) {
        result.street = {error: true, text: "Обязательное поле"}
    }
    if (!equity.address.building) {
        result.building = {error: true, text: "Обязательное поле"}
    } else if(equity.address.lat == null) {
        result.building = {error: true, text: "Местоположение не определено"}
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

export const setLocation = (address) => async (dispatch, getState) => {
    const {setEquityField} = slice.actions;
    let {equity, validation} = getState().addEquity;
    if (address?.street.length > 0 && address.building?.length > 0) {
        let locations = await geocode(CITY[address.city], address.street, address.building);
        if (address === equity.address) {
            if (locations?.filter(l => l.class === 'building').length > 0) {
                dispatch(setEquityField({
                    name: "address",
                    value: {...address, lat: locations[0].lat, lon: locations[0].lon}
                }));
                dispatch(setField({
                    name: "validation",
                    value: {...validation, building: {error: false, text: '✓ Местоположение определено'}}
                }))
            } else {
                dispatch(setEquityField({name: "address", value: {...address, lat: null, lon: null}}));
                dispatch(setField({name: "validation", value: {...validation, building: {error: false, text: ''}}}))
            }
        }
    } else {
        dispatch(setEquityField({name: "address", value: {...address, lat: null, lon: null}}));
        dispatch(setField({name: "validation", value: {...validation, building: {error: false, text: ''}}}))
    }
};

export const saveEquity = (equity) => async dispatch => {
    const {toggleDialog, setField} = slice.actions;
    const setSave = (v) => setField({name: "save", value: v});
    try {
        let errors = validate(equity);
        if (Object.entries(errors).length === 0) {
            let unfreeze = {...equity};
            let selectedFiles = getSelectedFiles();
            if (selectedFiles.length !== 0) {
                dispatch(setSave({uploadingFiles: true, uploadingFilesProgress: 0}));
                try {
                    unfreeze.photos = await PhotoAPI.upload(selectedFiles.map(f => f.file), (p) => dispatch(setSave({uploadingFiles: true, uploadingFilesProgress: p})))
                } finally {
                    dispatch(setSave({creatingEquity: true, uploadingFiles: false, uploadingFilesProgress: 0}));
                }
            }
            dispatch(setSave({creatingEquity: true}));
            try {
                await EquityAPI.create(unfreeze);
            } finally {
                dispatch(setSave({creatingEquity: false}));
            }
            dispatch(toggleDialog(false))
        } else
            dispatch(setField({name: "validation", value: errors}))
    } catch (reason) {
        dispatch(show(reason.message))
    }
};

export const loadDistricts = (city) => async (dispatch) => {
    const {setField} = slice.actions;
    try {
        let districts = await DirectoryAPI.fetchDistricts(city);
        dispatch(setField({name: "districts", value: districts}))
    } catch (reason) {
        dispatch(show(reason.message))
    }
};

export const loadSubways = (city) => async (dispatch) => {
    const {setField} = slice.actions;
    try {
        let subways = await DirectoryAPI.fetchSubways(city);
        dispatch(setField({name: "subways", value: subways}))
    } catch (reason) {
        dispatch(show(reason.message))
    }
};

export const fetchStreets = (city, query) => async (dispatch, getState) => {
    const {setField} = slice.actions;
    try {
        let streets = await KladrAPI.fetchStreets(city, query);
        const {streetText} = getState().addEquity;
        if (query === streetText)
            dispatch(setField({name: "streets", value: streets}))
    } catch (reason) {
        dispatch(show(reason.message))
    }
};