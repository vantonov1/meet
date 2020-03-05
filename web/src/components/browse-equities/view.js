import React, {useEffect, useState} from 'react';
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
import {Tabs} from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import {createRequest, setAbout} from "../create-request/slice";

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
    buttons: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        display: 'flex',
        justifyItems: 'right'
    }
}));

export default function BrowseEquities() {
    const {locations, filter, selectedEquity} = useSelector(state => state.browseEquities, shallowEqual);
    const dispatch = useDispatch();

    useEffect(() => {document.title = 'Митилка - объекты на карте'});

    useEffect(() => {
        OsmMap.setupClusters(locations);
        OsmMap.placeMarker(selectedEquity?.address.lon, selectedEquity?.address.lat)
    }, [locations, selectedEquity]);

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
    const {locations, records, selectedEquity, filter, drawerOpen} = useSelector(state => state.browseEquities, shallowEqual);
    const dispatch = useDispatch();
    const classes = useStyles();

    return <Drawer open={drawerOpen} variant={props.variant} onClose={() => dispatch(toggleDrawer(false))}>
        <Browse slice="browseEquities" title={EQUITY_TYPES[filter.type]} loader={loadLocations} className={classes.root}
                topLevel={true}>
            <EquitiesList
                equities={records}
                hasMore={records.length < locations.length}
                onFetch={() => dispatch(loadMoreEquities())}
                selectedEquity={selectedEquity}
                onClick={(equity) => {
                    dispatch(selectEquity(equity));
                }}
            />
        </Browse>
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
        {selectedEquity && <EquityProperties equity={selectedEquity}/>}
    </Drawer>
}

function EquityProperties(props) {
    const {equity} = props;
    const [tab, setTab] = useState(0);
    const classes = useStyles();
    const dispatch = useDispatch();

    return <div style={{minHeight: 200}}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
            <Tab key={1} label="Фото" disabled={equity.photos?.length === 0}/>
            <Tab key={2} label="Описание" disabled={equity.info == null}/>
            <Tab key={3} label="Комментарии"/>
        </Tabs>
        {tab === 0 && equity.photos?.length > 0 && <PhotoGallery images={equity.photos.map(f => PhotoAPI.url(f))}/>}
        {tab === 1 && equity.info && <Box className={classes.info}>
            {equity.info}
        </Box>}
        {tab === 2 && equity.comments?.length > 0 && <Box className={classes.info}>
            {equity.comments.map((c,i) => <p key={i}>{c.text}</p>)}
        </Box>}
        <div className={classes.buttons}>
            <Fab size="small" variant="extended" color="primary" style={{marginRight: 10}} onClick={() => {
                dispatch(setAbout(equity));
                dispatch(createRequest())
            }}>
                <CheckIcon/>
                {isSale(equity) && "Хочу купить"}
                {isRent(equity) && "Хочу снять"}
            </Fab>
            <Fab size="small" variant="extended"  onClick={() => {
                dispatch(unselectEquity())
            }}>
                <CloseIcon/>
            </Fab>
        </div>
    </div>
}


