import React, {useEffect, useState} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {addPhoto, reverseLocation, saveEquity, setEquityField, setField, setLocation, showAddEquity,} from "./slice";
import {Dialog} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import PhotoUpload from "../common/photo-upload";
import EditEquityContent from "../common/edit_equity_content";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DialogContent from "@material-ui/core/DialogContent";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import OsmMap from "../browse-equities/osm-map";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        left: theme.spacing(1),
        bottom: theme.spacing(1),
    },
}));

export default function AddEquity(props) {
    const {showDialog, equity, selectedPhotos, validation, save} = useSelector(state => state.addEquity, shallowEqual);
    const [selectLocation, setSelectLocation] = useState(false);
    const dispatch = useDispatch();
    const {type, city, fromRequest} = props;
    const classes = useStyles();

    useEffect(() => {
        if (equity.type !== type)
            dispatch(setEquityField({name: "type", value: type}));
        if (equity.address.city !== city)
            dispatch(setEquityField({name: "address", value: {...equity.address, city}}));
        dispatch(setField({name: "fromRequest", value: fromRequest?.id}));
    }, [equity.address.city, city, equity.type, type]);

    return (
        <div className={classes.root}>
            <SaveProgress save={save}/>
            <Dialog open={showDialog} maxWidth="xs">
                <DialogContent>
                    <EditEquityContent equity={equity} type={type} validation={validation}
                                       onSelectLocation={() => setSelectLocation(true)}
                                       onEquityFieldChange={change => {
                                           dispatch(setEquityField(change));
                                           if (change.name === 'address')
                                               dispatch(setLocation(change.value))
                                       }}
                    />
                </DialogContent>
                <DialogActions>
                    <PhotoUpload files={selectedPhotos} onFileUploaded={f => dispatch(addPhoto(f))}/>
                    <Button onClick={() => dispatch(showAddEquity(false))}>
                        Отменить
                    </Button>
                    <Button onClick={() => {
                        dispatch(saveEquity(equity))
                    }} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
            {selectLocation && <SelectLocation onClose={() => setSelectLocation(false)} onOk={(marker) => {
                setSelectLocation(false);
                dispatch(reverseLocation(marker[0], marker[1]))
            }}/>}
        </div>
    )
}

function SelectLocation(props) {
    const {onOk, onClose} = props;
    const [marker, setMarker] = useState([]);

    return <Dialog fullScreen open={true} onClose={onClose}>
        <AppBar className="location-picker-app-bar">
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
                <Button disabled={marker.length === 0} color="inherit" onClick={() => onOk(marker)}>
                    Сохранить
                </Button>
            </Toolbar>
        </AppBar>
        <OsmMap ref={OsmMap.ref} onPick={marker => {
            OsmMap.placeMarker(marker[0], marker[1]);
            setMarker(marker)
        }}/>
    </Dialog>
}


function SaveProgress(props) {
    const {save} = props;
    return <Dialog maxWidth="xs" fullWidth open={save.uploadingFiles || save.creatingEquity}>
        <div>
            {save.uploadingFiles &&
            <Typography gutterBottom align={"center"} variant="h5">Загрузка фотографий</Typography>}
            {save.creatingEquity && <Typography>Создание объекта</Typography>}
            {save.uploadingFiles && <LinearProgress value={save.uploadingFilesProgress} variant={"determinate"}/>}
        </div>
    </Dialog>;
}

