import React, {useEffect} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import Drawer from "@material-ui/core/Drawer";
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
import makeStyles from "@material-ui/core/styles/makeStyles";
import {EQUITY_TYPES} from "../common/constants";
import AddIcon from "@material-ui/icons/Add";
import {showAddEquity} from "../add-equity/slice";
import Browse from "../common/abstract-browser";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        width: 400,
        height: "100%",
    },
    addEquity: {
        left: theme.spacing(1),
        bottom: theme.spacing(1),
        position: "fixed"
    },
    equityInfo: {minHeight: theme.spacing(6)},
    info: {
        width: "100%",
        maxHeight: 100,
        marginBottom: theme.spacing(1),
        textAlign: "left"
    },
    unselectEquity: {position: "absolute", right: theme.spacing(1), top: theme.spacing(1)}
}));

export default function BrowseEquities() {
    const {locations, filter, selectedEquity} = useSelector(state => state.browseEquities, shallowEqual);
    const dispatch = useDispatch();

    useEffect(() => {
        OsmMap.setupClusters(locations);
        OsmMap.placeMarker(selectedEquity?.address.lon, selectedEquity?.address.lat)
    });

    return (
        <>
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
        </>
    );
}

function EquitiesDrawer(props) {
    const {locations, records, filter, drawerOpen} = useSelector(state => state.browseEquities, shallowEqual);
    const dispatch = useDispatch();
    const classes = useStyles();

    return <Drawer open={drawerOpen} variant={props.variant} onClose={() => dispatch(toggleDrawer(false))}>
        <Browse slice="browseEquities" title={EQUITY_TYPES[filter.type]} loader={loadLocations} className={classes.root} topLevel={true}>
            <EquitiesList
                equities={records}
                hasMore={records.length < locations.length}
                onFetch={() => dispatch(loadMoreEquities())}
                onClick={(equity) => {
                    dispatch(selectEquity(equity));
                }}
            />
        </Browse>
        <Fab color="primary" className={classes.addEquity}>
            <AddIcon onClick={() => dispatch(showAddEquity(true))}/>
        </Fab>
        <AddEquity type={filter.type} city={filter.city}/>
    </Drawer>;
}

function EquityInfoDrawer(props) {
    const {selectedEquity} = useSelector(state => state.browseEquities, shallowEqual);
    const dispatch = useDispatch();
    const classes = useStyles();
    return <Drawer open={selectedEquity != null}
                   variant={props.variant}
                   anchor="bottom"
                   onClose={() => dispatch(unselectEquity())}
                   ModalProps={{
                       keepMounted: true, // Better open performance on mobile.
                   }}>
        {(selectedEquity?.info || selectedEquity?.photos) && <div className={classes.equityInfo}>
            {selectedEquity.info && <Box className={classes.info}>
                {selectedEquity.info}
            </Box>}
            {selectedEquity.photos && <PhotoGallery images={selectedEquity.photos.map(f => PhotoAPI.url(f))}/>}
        </div>}
        <Fab className={classes.unselectEquity} size="small" onClick={() => {
            dispatch(unselectEquity())
        }}>
            <CloseIcon/>
        </Fab>
    </Drawer>
}


