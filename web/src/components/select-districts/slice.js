import {createSlice} from "@reduxjs/toolkit";
import {show} from "../error/slice"
import DirectoryAPI from "../../api/DirectoryAPI";

const slice = createSlice({
    name: 'select-districts',
    initialState: {
        selectDistricts: false,
        districts: [],
        selected: [],
        filter: ''
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
        setFilter: (state, {payload}) => {
            state.filter = payload
        },
        setSelection: (state, {payload}) => {
                state.selected = payload
        },
    }
});

export default slice.reducer
export const {showDistrictsSelector, hideDistrictsSelector, setSelection, setFilter} = slice.actions;

export const loadDistricts = (city) => async dispatch => {
    const {setDistricts} = slice.actions;
    try {
        dispatch(setDistricts(await DirectoryAPI.fetchDistricts(city)))
    } catch (reason) {
        dispatch(show(reason.message))
    }
};

