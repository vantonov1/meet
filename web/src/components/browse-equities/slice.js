import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice"
import EquityPublicAPI from "../../api/EquityPublicAPI";

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
        updateEquities: state => {
            state.records = [];
            state.loadFinished = false;
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
export const {toggleDrawer, updateEquities, setType, districtsSelected, subwaysSelected, priceRangeSelected, priceRangeCommitted, selectEquity, unselectEquity} = slice.actions;

export const loadEquities = (ids) => async (dispatch) => {
    const {setEquities, startLoading, finishLoading} = slice.actions;
    dispatch(startLoading());
    try {
        dispatch(setEquities(await EquityPublicAPI.findByIds(ids)))
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
            let locations = await EquityPublicAPI.findLocations(filter);
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
    let page = await EquityPublicAPI.findByIds(locations.slice(alreadyLoaded.length, alreadyLoaded.length + 50).map(l => l.id));
    return alreadyLoaded.concat(page);
}

export const findEquitiesByAddress = (type, address) => async (dispatch, getState) => {
    const {setEquities, startLoading, finishLoading} = slice.actions;
    const {loading, loadFinished} = getState().browseEquities;
    if (!loading && !loadFinished && type && address.street?.length > 0) {
        dispatch(startLoading());
        try {
            dispatch(setEquities(await EquityPublicAPI.findEquitiesByAddress(type, address.city, address.street, address.building)))
        } catch (reason) {
            dispatch(showError(reason.message))
        } finally {
            dispatch(finishLoading())
        }
    }
};

