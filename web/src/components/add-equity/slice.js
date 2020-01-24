import {createSlice} from "@reduxjs/toolkit";
import {show} from "../show-error/slice"
import DirectoryAPI from "../../api/DirectoryAPI";
import KladrAPI from "../../api/KladrAPI";
import EquityAPI from "../../api/EquityAPI";

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
    }
});

export default slice.reducer
export const {toggleDialog, setEquity, setAddress, setStreetText} = slice.actions;

export const saveEquity = (equity) => async (dispatch) => {
    const {toggleDialog} = slice.actions;
    try {
        await EquityAPI.create(equity);
        dispatch(toggleDialog(false))
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