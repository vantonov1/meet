import React, {useEffect, useLayoutEffect} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
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
import Toolbar from "@material-ui/core/Toolbar";
import {EQUITY_TYPES} from "../common/constants";
import {setAppTitle} from "../app-bar/slice";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        width: 400,
        height: "100%",
    },
    progress: {position: "absolute", width: '100%', textAlign: 'center', marginTop: theme.spacing(1)},
    noItems: {width: '100%', textAlign: 'center', marginTop: theme.spacing(1)},
    equityInfo: {minHeight:theme.spacing(6)},
    info: {
        width: "100%",
        maxHeight:100,
        marginBottom: theme.spacing(1),
        textAlign: "left"
    },
    unselectEquity: {position: "absolute", right: theme.spacing(1), top: theme.spacing(1)}
}));

export default function BrowseEquities() {
    const {locations, filter} = useSelector(state => state.browseEquities, shallowEqual);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadLocations());
        OsmMap.setupClusters(locations)
    });

    useLayoutEffect(() => {
        dispatch(setAppTitle(EQUITY_TYPES[filter.type]))
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
    const classes = useStyles();

    return <Drawer open={drawerOpen} variant={props.variant} onClose={() => dispatch(toggleDrawer(false))}>
        <Toolbar />
        {<Box className={classes.root}>
            {loading && <span className={classes.progress}><CircularProgress/></span>}
            {!loading && equities.length === 0 && <span className={classes.noItems}>Нет записей</span>}
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


