import {createSlice} from "@reduxjs/toolkit";
import EquityAPI from "../../api/EquityAPI";
import {show} from "../error/slice"

const slice = createSlice({
    name: 'browse-equities',
    initialState: {
        equities: [],
        locations: [],
        loading: false,
        loadFinished: false,
        filter: {type: ["RENT_FLAT"]},
        drawerOpen: true,
        mapRendered: false,
        containerHeight: 0
    },
    reducers: {
        setLocations: (state, {payload}) => {
            state.locations = payload
        },
        setEquities: (state, {payload}) => {
            state.equities = payload
        },
        startLoading: state => {
            state.loading = true;
        },
        finishLoading: state => {
            state.loading = false;
            state.loadFinished = true;
        },
        toggleDrawer: (state, {payload}) => {
            state.drawerOpened = payload
        },
        storeMap: state => {
            state.mapRendered = true
        },
        storeContainerHeight: (state, {payload}) => {
            state.containerHeight = payload;
        },
        setType: (state, {payload}) => {
            state.filter.type = payload;
            state.loadFinished = false;
        },
    }
});

export default slice.reducer
export const {toggleDrawer, storeMap, storeContainerHeight, setType} = slice.actions;

export const loadEquities = (ids) => async (dispatch) => {
    const {setEquities, startLoading, finishLoading} = slice.actions;
    dispatch(startLoading());
    try {
        dispatch(setEquities(await EquityAPI.findByIds(ids)))
    } catch (reason) {
        dispatch(show(reason.message))
    } finally {
        dispatch(finishLoading())
    }
};

export const loadMoreEquities = () => async (dispatch, getState) => {
    const {setEquities} = slice.actions;
    const {locations, equities} = getState().browseEquities;
    try {
        dispatch(setEquities(await loadPage(locations, equities)))
    } catch (reason) {
        dispatch(show(reason.message))
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
            dispatch(show(reason.message))
        } finally {
            dispatch(finishLoading())
        }
    }
};

async function loadPage(locations, alreadyLoaded) {
    let page = await EquityAPI.findByIds(locations.slice(alreadyLoaded.length, alreadyLoaded.length + 50).map(l => l.id));
    return alreadyLoaded.concat(page);
}

