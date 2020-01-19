import React, {useEffect, useLayoutEffect} from 'react';
import './styles.css'
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Drawer from "@material-ui/core/Drawer";
import "./osm-map.css"
import {loadLocations, loadMoreEquities, storeContainerHeight, storeMap, toggleDrawer} from "./slice";
import EquitiesList from "./equities-list";
import Box from "@material-ui/core/Box";
import OsmMap from "./osm-map";

export default function BrowseEquities() {
    const {equities, filter, loading, drawerOpen, mapRendered, locations, containerHeight} = useSelector(state => state.browseEquities, shallowEqual);
    const dispatch = useDispatch();
    const listContainerRef = React.createRef();

    useLayoutEffect(() => {
        let rect = listContainerRef.current.getBoundingClientRect();
        if (rect?.height > 0)
            dispatch(storeContainerHeight(rect.height))
    });

    useEffect(() => {
        dispatch(loadLocations())
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
            </Drawer>
            <Box width="100%" height="100%">
                <OsmMap locations={locations} mapRendered={mapRendered} onMapRendered={() => dispatch(storeMap())}/>
            </Box>
        </div>
    );
}
