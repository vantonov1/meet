import React, {useEffect, useLayoutEffect} from 'react';
import './styles.css'
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Drawer from "@material-ui/core/Drawer";
import "./osm-map.css"
import EquitiesList from "./equities-list";
import Box from "@material-ui/core/Box";
import OsmMap from "./osm-map";
import FilterMenu from "./filter-menu";
import {
    districtsSelected,
    loadEquities,
    loadLocations,
    loadMoreEquities,
    setType,
    storeContainerHeight,
    toggleDrawer
} from "./slice";

export default function BrowseEquities() {
    const {locations, equities, filter, loading, drawerOpen, containerHeight} = useSelector(state => state.browseEquities, shallowEqual);
    const dispatch = useDispatch();
    const listContainerRef = React.createRef();

    useLayoutEffect(() => {
        let rect = listContainerRef.current.getBoundingClientRect();
        if (rect?.height > 0)
            dispatch(storeContainerHeight(rect.height))
    });

    useEffect(() => {
        dispatch(loadLocations());
        OsmMap.setupClusters(locations)
    });

    return (
        <div ref={listContainerRef}>
            <Drawer open={drawerOpen} variant="permanent" onClose={() => dispatch(toggleDrawer(false))}>
                <Box width={400}>
                    {loading && <CircularProgress/>}
                    {equities.length !== 0 && <EquitiesList
                        equities={equities}
                        height={containerHeight}
                        hasMore={equities.length < locations.length}
                        onFetch={() => dispatch(loadMoreEquities())}
                    />}
                </Box>
                <FilterMenu
                    filter={filter}
                    onTypeSelected={(type) => dispatch(setType(type))}
                    onDistrictsSelected={(districts) => dispatch(districtsSelected(districts))}
                />
            </Drawer>
            <OsmMap
                ref={OsmMap.ref}
                onLocationsSelect={(locations) => dispatch(loadEquities(locations))}
            />
        </div>
    );
}
