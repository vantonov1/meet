import {createSlice} from "@reduxjs/toolkit";
import {show} from "../show-error/slice"
import DirectoryAPI from "../../api/DirectoryAPI";
import KladrAPI from "../../api/KladrAPI";

const slice = createSlice({
    name: 'add-equity',
    initialState: {
        showDialog: false,
        equity: {
            type: 0,
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
            price: 0,
            square: 0,
            rooms: 0,
            info: ''
        },
        photos: [],
        districts: [],
        subways: [],
        streets: [],
        streetText: ''
    },
    reducers: {
        toggleDialog: (state, {payload}) => {
            state.showDialog = payload
        },
        setEquity: (state, {payload}) => {
            state.equity = payload
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
    }
});

export default slice.reducer
export const {toggleDialog, setEquity, setStreetText} = slice.actions;

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