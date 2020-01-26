import React, {useEffect} from 'react';
import './styles.css'
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Drawer from "@material-ui/core/Drawer";
import "./osm-map.css"
import EquitiesList from "../common/equities-list";
import Box from "@material-ui/core/Box";
import OsmMap from "./osm-map";
import FilterMenu from "../set-filter/view";
import {
    districtsSelected,
    loadEquities,
    loadLocations,
    loadMoreEquities,
    priceRangeCommitted,
    priceRangeSelected,
    selectEquity,
    setType,
    subwaysSelected,
    toggleDrawer,
    unselectEquity,
} from "./slice";
import AddEquity from "../add-equity/view";
import PhotoAPI from "../../api/PhotoAPI";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";

export default function BrowseEquities() {
    const {locations, filter} = useSelector(state => state.browseEquities, shallowEqual);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadLocations());
        OsmMap.setupClusters(locations)
    });

    return (
        <div>
            <EquitiesDrawer variant="permanent"/>}
            <EquityInfoDrawer variant="temporary"/>
            <OsmMap ref={OsmMap.ref} onLocationsSelect={(locations) => dispatch(loadEquities(locations))}/>
            <FilterMenu
                filter={filter}
                onTypeSelected={(type) => dispatch(setType(type))}
                onDistrictsSelected={(districts) => dispatch(districtsSelected(districts))}
                onSubwaysSelected={(subways) => dispatch(subwaysSelected(subways))}
                onPriceRangeSelected={value => dispatch(priceRangeSelected(value))}
                onPriceRangeCommitted={() => dispatch(priceRangeCommitted())}
            />
        </div>
    );
}

function EquitiesDrawer(props) {
    const {locations, equities, filter, loading, drawerOpen} = useSelector(state => state.browseEquities, shallowEqual);
    const dispatch = useDispatch();
    return <Drawer open={drawerOpen} variant={props.variant} onClose={() => dispatch(toggleDrawer(false))}>
        {<Box width={400} height="100%">
            {loading && <CircularProgress/>}
            {!loading && equities.length === 0 && <span>Нет записей</span>}
            {equities.length !== 0 && <EquitiesList
                equities={equities}
                hasMore={equities.length < locations.length}
                onFetch={() => dispatch(loadMoreEquities())}
                onClick={(equity) => {
                    dispatch(selectEquity(equity))
                }}
            />}
        </Box>}
        <AddEquity type={filter.type} city={filter.city}/>
    </Drawer>;
}

function EquityInfoDrawer(props) {
    const {selectedEquity} = useSelector(state => state.browseEquities, shallowEqual);
    const dispatch = useDispatch();
    return <SwipeableDrawer open={selectedEquity != null}
                            variant={props.variant}
                            anchor="bottom"
                            onOpen={() => {
                            }}
                            onClose={() => dispatch(unselectEquity())}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}>
        {selectedEquity && <div className="equity-info">
            <Box width="100%" style={{maxHeight:"100px", marginBottom: "10px"}}>
                {selectedEquity.info}
            </Box>
            <div className="image-preview" style={{overflowX: "auto"}}>
                {selectedEquity.photos?.map(f => <img key={f} style={{maxWidth: 150, maxHeight: 150}}
                                                      src={PhotoAPI.url(f)} alt="Здесь было фото"/>)}
            </div>
        </div>}
    </SwipeableDrawer>
}


