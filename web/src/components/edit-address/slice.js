import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice"
import DirectoryAPI from "../../api/DirectoryAPI";
import AddressAPI from "../../api/AddressAPI";

const slice = createSlice({
    name: 'edit-address',
    initialState: {
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
        },
        districts: [],
        subways: [],
        streets: [],
        streetText: '',
    },
    reducers: {
        setAddress: (state, {payload}) => {
            state.address = payload
        },
        setAddressField: (state, {payload}) => {
            state[payload.name] = payload.value
        },
    }
});

export default slice.reducer
export const {setAddress, setAddressField} = slice.actions;

export const loadDistricts = (city) => async (dispatch) => {
    try {
        let districts = await DirectoryAPI.fetchDistricts(city);
        dispatch(setAddressField({name: "districts", value: districts}))
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

export const loadSubways = (city) => async (dispatch) => {
    try {
        let subways = await DirectoryAPI.fetchSubways(city);
        dispatch(setAddressField({name: "subways", value: subways}))
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

export const fetchStreets = (city, query) => async (dispatch, getState) => {
    try {
        let streets = await AddressAPI.fetchStreets(city, query);
        const {streetText} = getState().editAddress;
        if (query === streetText)
            dispatch(setAddressField({name: "streets", value: streets}))
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};