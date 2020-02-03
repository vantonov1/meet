import {createSlice} from "@reduxjs/toolkit";
import EquityAPI from "../../api/EquityAPI";
import {showError} from "../show-error/slice"

const slice = createSlice({
    name: 'browse-equities',
    initialState: {
        records: [],
        locations: [],
        loading: false,
        loadFinished: false,
        filter: {city: 2, type: "RENT_ROOM", district: [], subway: [], minPrice:null, maxPrice: null},
        drawerOpen: true,
        selectedEquity: null
    },
    reducers: {
        setLocations: (state, {payload}) => {
            state.locations = payload
        },
        setEquities: (state, {payload}) => {
            state.records = payload
        },
        startLoading: state => {
            state.loading = true;
            state.selectedEquity = null
        },
        finishLoading: state => {
            state.loading = false;
            state.loadFinished = true;
        },
        toggleDrawer: (state, {payload}) => {
            state.drawerOpened = payload
        },
        setType: (state, {payload}) => {
            state.filter.type = payload;
            state.loadFinished = false;
        },
        districtsSelected: (state, {payload}) => {
            state.filter.district = payload;
            state.loadFinished = false;
        },
        subwaysSelected: (state, {payload}) => {
            state.filter.subway = payload;
            state.loadFinished = false;
        },
        priceRangeSelected: (state, {payload}) => {
            state.filter.minPrice = payload[0];
            state.filter.maxPrice = payload[1];
        },
        priceRangeCommitted: (state) => {
            state.loadFinished = false;
        },
        selectEquity: (state, {payload}) => {
            state.selectedEquity = payload
        },
        unselectEquity: (state) => {
            state.selectedEquity = null
        },
    }
});

export default slice.reducer
export const {toggleDrawer, setType, districtsSelected, subwaysSelected, priceRangeSelected, priceRangeCommitted, selectEquity, unselectEquity} = slice.actions;

export const loadEquities = (ids) => async (dispatch) => {
    const {setEquities, startLoading, finishLoading} = slice.actions;
    dispatch(startLoading());
    try {
        dispatch(setEquities(await EquityAPI.findByIds(ids)))
    } catch (reason) {
        dispatch(showError(reason.message))
    } finally {
        dispatch(finishLoading())
    }
};

export const loadMoreEquities = () => async (dispatch, getState) => {
    const {setEquities} = slice.actions;
    const {locations, records} = getState().browseEquities;
    try {
        dispatch(setEquities(await loadPage(locations, records)))
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};

export const loadLocations = () => async (dispatch, getState) => {
    const {setLocations, setEquities, startLoading, finishLoading} = slice.actions;
    const {loading, loadFinished, filter} = getState().browseEquities;
    if (!loading && !loadFinished) {
        dispatch(startLoading());
        try {
            let locations = await EquityAPI.findLocations(filter);
            dispatch(setLocations(locations));
            dispatch(setEquities(await loadPage(locations, [])))
        } catch (reason) {
            dispatch(showError(reason.message))
        } finally {
            dispatch(finishLoading())
        }
    }
};

async function loadPage(locations, alreadyLoaded) {
    let page = await EquityAPI.findByIds(locations.slice(alreadyLoaded.length, alreadyLoaded.length + 50).map(l => l.id));
    return alreadyLoaded.concat(page);
}

