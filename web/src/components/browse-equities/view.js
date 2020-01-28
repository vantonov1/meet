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
import PhotoGallery from "../common/photo-gallery";
import CloseIcon from "@material-ui/icons/Close";
import Fab from "@material-ui/core/Fab";

export default function BrowseEquities() {
    const {locations, filter} = useSelector(state => state.browseEquities, shallowEqual);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadLocations());
        OsmMap.setupClusters(locations)
    });

    return (
        <div>
            <EquitiesDrawer variant="permanent"/>
            <EquityInfoDrawer variant="permanent"/>
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
            {loading && <CircularProgress style={{position: "absolute"}}/>}
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
    return <Drawer open={selectedEquity != null}
                            variant={props.variant}
                            anchor="bottom"
                            onClose={() => dispatch(unselectEquity())}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}>
        {(selectedEquity?.info || selectedEquity?.photos) && <div className="equity-info" style={{minHeight:50}}>
            {selectedEquity.info && <Box width="100%" style={{maxHeight:"100px", marginBottom: "10px", textAlign: "left"}}>
                {selectedEquity.info}
            </Box>}
            {selectedEquity.photos && <PhotoGallery images={selectedEquity.photos.map(f => PhotoAPI.url(f))}/>}
         </div>}
        <Fab style={{position: "absolute", right: 5, top: 5}} size="small" onClick={() => {
            dispatch(unselectEquity())
        }}>
            <CloseIcon/>
        </Fab>
    </Drawer>
}


