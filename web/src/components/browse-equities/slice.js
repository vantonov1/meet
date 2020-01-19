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
        storeMap: (state, {payload}) => {
            state.mapRendered = true
        },
        storeContainerHeight: (state, {rect}) => {
            state.containerHeight=rect.bottom - rect.top;
        },
    }
});

export default slice.reducer
export const {toggleDrawer, storeMap, storeContainerHeight} = slice.actions;

export const loadMoreEquities = () => async (dispatch, getState) => {
    const {setEquities} = slice.actions;
    const {locations, equities} = getState().browseEquities;
    try {
        let page = await EquityAPI.findByIds(locations.slice(equities.length, equities.length + 100).map(l => l.id));
        dispatch(setEquities(equities.concat(page)))
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
            let firstPage = await EquityAPI.findByIds(locations.slice(0, 20).map(l => l.id));
            dispatch(setEquities(firstPage))
        } catch (reason) {
            dispatch(show(reason.message))
        } finally {
            dispatch(finishLoading())
        }
    }
};
