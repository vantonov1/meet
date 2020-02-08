import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice";
import EquityPublicAPI from "../../api/EquityPublicAPI";

const slice = createSlice({
    name: 'set-filter',
    initialState: {
        selectSubways: false,
        selectDistricts: false,
        minPrice:null,
        maxPrice: null
    },
    reducers: {
        showSubwaysSelector: state => {
            state.selectSubways = true
        },
        hideSubwaysSelector: state => {
            state.selectSubways = false
        },
        showDistrictsSelector: state => {
            state.selectDistricts = true
        },
        hideDistrictsSelector: state => {
            state.selectDistricts = false
        },
        setPriceRange: (state, {payload}) => {
            state.minPrice = payload['minPrice'];
            state.maxPrice = payload['maxPrice']
        },
    }
});

export default slice.reducer
export const {showSubwaysSelector, hideSubwaysSelector, showDistrictsSelector, hideDistrictsSelector} = slice.actions;

export const getPriceRange = (filter) => async (dispatch) => {
    const {setPriceRange} = slice.actions;
    try {
        dispatch(setPriceRange(await EquityPublicAPI.getPriceRange(filter)))
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};
