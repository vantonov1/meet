import {createSlice} from "@reduxjs/toolkit";
import EquityAPI from "../../api/EquityAPI";
import {show} from "../show-error/slice";

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
        dispatch(setPriceRange(await EquityAPI.getPriceRange(filter)))
    } catch (reason) {
        dispatch(show(reason.message))
    }
};
