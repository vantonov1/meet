import React, {useEffect, useLayoutEffect, useState} from 'react';
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
import CheckIcon from "@material-ui/icons/Check";
import Fab from "@material-ui/core/Fab";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {EQUITY_TYPES, isRent, isSale} from "../common/constants";
import Browse from "../common/abstract-browser";
import {Tabs, useMediaQuery} from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import {createRequest, setAbout} from "../create-request/slice";

const useStyles = makeStyles(theme => ({
    equitiesDrawer: {
        display: 'flex',
        [theme.breakpoints.down('xs')]: {
            width: '100%'
        },
        [theme.breakpoints.up('sm')]: {
            width: 400,
        },
        height: "100%",
    },
    infoDrawer: {
        [theme.breakpoints.down('xs')]: {
            height: '100%'
        },
        [theme.breakpoints.up('sm')]: {
            minHeight: 200,
        },
        height: "100%",
    },
    closeDrawer: {
        position: 'fixed',
        right: theme.spacing(2),
        top: theme.spacing(2) + theme.mixins.toolbar.minHeight
    },
    filter: {
        position: 'fixed',
        right: theme.spacing(1),
        top: theme.spacing(2) + theme.mixins.toolbar.minHeight
    },
    filterAtBottom: {
        position: 'fixed',
        right: theme.spacing(2),
        bottom: theme.spacing(1)
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
    buttons: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        display: 'flex',
        justifyItems: 'right'
    },
    drawerOpen: {
        width: '100%',
        height: '100%',
        position: 'fixed'
    },
    drawerClosed: {display: 'none'},
    mapOpen: {
        width: '100%',
        height: '100%',
        position: 'fixed'
    },
    mapClosed: {display: 'none'},
    infoOpen: {
        width: '100%',
        height: '100%',
        position: 'fixed',
        marginTop: theme.spacing(1)
    },
    infoClosed: {display: 'none'},
    gallery: {
        bottom: 0,
        position: 'fixed',
        width: '100%'
    },
    buy: {
        position: 'fixed',
        right: theme.spacing(1),
        bottom: 150 + theme.spacing(1)
    },
    underAppBar: {
        marginTop:theme.mixins.toolbar.minHeight,
        height: '100%'
    }
}));

export default function BrowseEquities() {
    const {locations, filter, selectedEquity, drawerOpen} = useSelector(state => state.browseEquities, shallowEqual);
    const dispatch = useDispatch();
    const largeScreen = useMediaQuery(theme => theme.breakpoints.up('sm'));

    useLayoutEffect(() => {
        dispatch(toggleDrawer(largeScreen))
    }, [largeScreen]);

    useEffect(() => {
        document.title = 'Митилка - объекты на карте'
    });

    useEffect(() => {
        OsmMap.setupClusters(locations);
        OsmMap.placeMarker(selectedEquity?.address.lon, selectedEquity?.address.lat)
    }, [locations, selectedEquity]);

    return largeScreen ? EquitiesViewNormal() : EquitiesViewSmall()
}

function EquitiesViewNormal() {
    const {filter, drawerOpen, selectedEquity} = useSelector(state => state.browseEquities, shallowEqual);
    const classes = useStyles();
    const dispatch = useDispatch();
    return <>
        <Drawer open={drawerOpen} variant="permanent" onClose={() => dispatch(toggleDrawer(false))}>
            <div className={classes.underAppBar}>
                <EquitiesBrowser/>
                <AddEquity type={filter.type} city={filter.city}/>
            </div>
        </Drawer>
        <OsmMap ref={OsmMap.ref} onLocationsSelect={locations => {
            dispatch(loadEquities(locations));
        }}/>
        <FilterMenu
            filter={filter}
            className={classes.filter}
            onTypeSelected={(type) => dispatch(setType(type))}
            onDistrictsSelected={(districts) => dispatch(districtsSelected(districts))}
            onSubwaysSelected={(subways) => dispatch(subwaysSelected(subways))}
            onPriceRangeSelected={value => dispatch(priceRangeSelected(value))}
            onPriceRangeCommitted={() => dispatch(priceRangeCommitted())}
        />
        <Drawer open={selectedEquity != null}
                variant="permanent"
                anchor="bottom"
                onClose={() => dispatch(unselectEquity())}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}>
            {selectedEquity && <EquityProperties equity={selectedEquity}/>}
        </Drawer>
    </>;
}

function EquitiesViewSmall() {
    const {filter, drawerOpen, selectedEquity} = useSelector(state => state.browseEquities, shallowEqual);
    const classes = useStyles();
    const dispatch = useDispatch();
    return <>
        <Box className={drawerOpen && !selectedEquity ? classes.drawerOpen : classes.drawerClosed}>
            <EquitiesBrowser/>
            <AddEquity type={filter.type} city={filter.city}/>
        </Box>
        {drawerOpen && !selectedEquity && <Fab size="small" className={classes.closeDrawer}>
            <CloseIcon onClick={() => dispatch(toggleDrawer(false))}/>
        </Fab>}
        <OsmMap ref={OsmMap.ref}
                className={drawerOpen ? classes.mapClosed : classes.mapOpen}
                onLocationsSelect={locations => {
                    dispatch(loadEquities(locations));
                    dispatch(toggleDrawer(true))
                }}/>
        {!selectedEquity && <FilterMenu
            filter={filter}
            className={classes.filterAtBottom}
            onTypeSelected={(type) => dispatch(setType(type))}
            onDistrictsSelected={(districts) => dispatch(districtsSelected(districts))}
            onSubwaysSelected={(subways) => dispatch(subwaysSelected(subways))}
            onPriceRangeSelected={value => dispatch(priceRangeSelected(value))}
            onPriceRangeCommitted={() => dispatch(priceRangeCommitted())}
        />}
        <Box className={selectedEquity ? classes.infoOpen : classes.infoClosed}>
            {selectedEquity && <EquityProperties equity={selectedEquity}/>}
        </Box>
    </>;
}

function EquitiesBrowser(props) {
    const {locations, records, selectedEquity, filter} = useSelector(state => state.browseEquities, shallowEqual);
    const dispatch = useDispatch();
    const classes = useStyles();

    return <Browse slice="browseEquities"
                   title={EQUITY_TYPES[filter.type]}
                   loader={loadLocations}
                   className={classes.equitiesDrawer}
    >
        <EquitiesList
            equities={records}
            hasMore={records.length < locations.length}
            onFetch={() => dispatch(loadMoreEquities())}
            selectedEquity={selectedEquity}
            onClick={(equity) => {
                dispatch(selectEquity(equity));
            }}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
        />
    </Browse>
}

function EquityProperties(props) {
    const {equity} = props;
    const [tab, setTab] = useState(0);
    const classes = useStyles();
    const dispatch = useDispatch();

    return <div className={classes.infoDrawer}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
            <Tab key={2} label="Описание" disabled={equity.info == null}/>
            <Tab key={3} label="Комментарии"/>
        </Tabs>
        {tab === 0 && equity.info && <Box className={classes.info}>
            {equity.info}
        </Box>}
        {tab === 1 && equity.comments?.length > 0 && <Box className={classes.info}>
            {equity.comments.map((c, i) => <p key={i}>{c.text}</p>)}
        </Box>}
        {equity.photos?.length > 0 && <div className={classes.gallery}>
            <PhotoGallery images={equity.photos.map(f => PhotoAPI.url(f))}/>
        </div>}
        <Fab size="small" className={classes.closeDrawer} onClick={() => {
            dispatch(unselectEquity())
        }}>
            <CloseIcon/>
        </Fab>
        <Fab size="small" variant="extended" color="primary" className={classes.buy} onClick={() => {
            dispatch(setAbout(equity));
            dispatch(createRequest())
        }}>
            <CheckIcon/>
            {isSale(equity) && "Хочу купить"}
            {isRent(equity) && "Хочу снять"}
        </Fab>
    </div>
}


