import React, {useEffect} from "react";
import "./style.css"
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import {
    addPhoto,
    fetchStreets,
    loadDistricts,
    loadSubways,
    saveEquity,
    setEquityField,
    setField,
    toggleDialog,
} from "./slice";
import {Dialog, LinearProgress} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import PhotoUpload from "../common/photo-upload";
import Typography from "@material-ui/core/Typography";
import EditEquityContent from "./EditEquityContent";

export default function AddEquity(props) {
    const {showDialog, equity, selectedPhotos, districts, subways, streets, streetText, validation, save} = useSelector(state => state.addEquity, shallowEqual);
    const dispatch = useDispatch();
    const {type, city} = props;

    useEffect(() => {
        if (equity.type !== type)
            dispatch(setEquityField({name: "type", value: type}));
        if (equity.address.city !== city)
            dispatch(setEquityField({name: "address", value: {...equity.address, city}}));
    }, [equity.address.city, city, equity.type, type]);

    useEffect(() => {
        if (districts?.length === 0)
            dispatch(loadDistricts(city));
    }, [districts, city]);

    useEffect(() => {
        if (subways?.length === 0)
            dispatch(loadSubways(city));
    }, [subways, city]);

    useEffect(() => {
        if (streetText && streets?.length === 0)
            dispatch(fetchStreets(city, streetText))
    }, [streetText, city]);

    return (
        <div className="add-dialog">
            <Fab color="primary">
                <AddIcon onClick={() => dispatch(toggleDialog(true))}/>
            </Fab>
            <SaveProgress save={save}/>
            <Dialog open={showDialog} maxWidth="xs">
                <EditEquityContent equity={equity} type={type} validation={validation}
                                   districts={districts} subways={subways}
                                   streets={streets} streetText={streetText}
                                   onFieldChange={change => dispatch(setField(change))}
                                   onEquityFieldChange={change => dispatch(setEquityField(change))}
                />
                <DialogActions>
                    <PhotoUpload files={selectedPhotos} onFileUploaded={f => dispatch(addPhoto(f))}/>
                    <Button onClick={() => dispatch(toggleDialog(false))}>
                        Отменить
                    </Button>
                    <Button onClick={() => {
                        dispatch(saveEquity(equity))
                    }} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
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

