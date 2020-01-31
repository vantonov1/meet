import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice"
import DirectoryAPI from "../../api/DirectoryAPI";

const slice = createSlice({
    name: 'select-districts',
    initialState: {
        districts: [],
    },
    reducers: {
        setDistricts: (state, {payload}) => {
            state.districts = payload
        },
    }
});

export default slice.reducer

export const loadDistricts = (city) => async dispatch => {
    const {setDistricts} = slice.actions;
    try {
        dispatch(setDistricts(await DirectoryAPI.fetchDistricts(city)))
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

