import {createSlice} from "@reduxjs/toolkit";
import {show} from "../error/slice"
import DirectoryAPI from "../../api/DirectoryAPI";

const slice = createSlice({
    name: 'select-districts',
    initialState: {
        selectDistricts: false,
        districts: [],
        selected: []
    },
    reducers: {
        showDistrictsSelector: state => {
            state.selectDistricts = true
        },
        hideDistrictsSelector: state => {
            state.selectDistricts = false
        },
        setDistricts: (state, {payload}) => {
            state.districts = payload
        },
        districtChecked: (state, {payload}) => {
            if (!state.selected.includes(payload))
                state.selected.push(payload)
        },
        districtUnchecked: (state, {payload}) => {
            if (state.selected.includes(payload))
                state.selected.splice(state.selected.indexOf(payload), 1);
        },
    }
});

export default slice.reducer
export const {showDistrictsSelector, hideDistrictsSelector, districtChecked, districtUnchecked} = slice.actions;

export const loadDistricts = (city) => async dispatch => {
    const {setDistricts} = slice.actions;
    try {
        dispatch(setDistricts(await DirectoryAPI.fetchDistricts(city)))
    } catch (reason) {
        dispatch(show(reason.message))
    }
};

