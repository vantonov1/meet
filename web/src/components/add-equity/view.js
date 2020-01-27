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
    setAddress,
    setEquity,
    setStreetText,
    toggleDialog,
} from "./slice";
import {Dialog, MenuItem, Select} from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {TYPES} from "../common/equity-types";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import PhotoUpload from "../common/photo-upload";
import PhotoGallery from "../common/photo-gallery";

export default function AddEquity(props) {
    const {showDialog, equity, selectedPhotos, districts, subways, streets, streetText, validation} = useSelector(state => state.addEquity, shallowEqual);
    const dispatch = useDispatch();
    const {type, city} = props;

    useEffect(() => {
        if (equity.type !== type)
            dispatch(setEquity({...equity, type}));
        if (equity.address.city !== city)
            dispatch(setAddress({...equity.address, city}));
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
            <Dialog open={showDialog} maxWidth="xs">
                <DialogContent>
                    <Select label="Тип"
                            required
                            value={equity.type ? equity.type : type}
                            fullWidth
                            onChange={e => dispatch(setEquity({...equity, type: e.target.value}))}>
                        {Object.entries(TYPES).map(k => <MenuItem key={k[0]} value={k[0]}>{k[1]}</MenuItem>)}
                    </Select>
                    <SelectDirectory label="Район"
                                     options={districts}
                                     value={equity.district}
                                     onChange={(e, v) => dispatch(setAddress({...equity.address, district: v}))}
                    />
                    <SelectDirectory label="Станция метро"
                                     options={subways}
                                     value={equity.subway}
                                     onChange={(e, v) => dispatch(setAddress({...equity.address, subway: v}))}
                    />
                    <SelectStreet label="Улица"
                                  options={streets}
                                  value={equity.street}
                                  error={validation.street?.error}
                                  helperText={validation.street?.text}
                                  inputValue={streetText}
                                  onChange={(e, v) => {
                                      dispatch(setAddress({...equity.address, street: v}));
                                      dispatch(setStreetText(v))
                                  }}
                                  onInputChange={e => {
                                      if (e?.type === 'change') dispatch(setStreetText(e.target.value))
                                  }}
                    />
                    <TextField label="Дом"
                               value={equity.building}
                               onChange={e => dispatch(setAddress({...equity.address, building: e.target.value}))}
                    />
                    <TextField label="Цена"
                               type="number"
                               required  error={validation.price?.error} helperText={validation.price?.text}
                               inputProps={{ inputMode: 'decimal', step: 100000}}
                               value={equity.price}
                               onChange={e => dispatch(setEquity({...equity, price: e.target.value}))}
                    />
                    <TextField label="Площадь"
                               type="number"
                               required error={validation.square?.error} helperText={validation.square?.text}
                               inputProps={{ inputMode: 'decimal'}}
                               value={equity.square}
                               onChange={e => dispatch(setEquity({...equity, square: e.target.value}))}
                    />
                    <TextField label="Количество комнат"
                               type="number"
                               inputProps={{ inputMode: 'decimal'}}
                               value={equity.rooms}
                               onChange={e => dispatch(setEquity({...equity, rooms: e.target.value}))}
                    />
                    <TextField label="Дополнительная информация"
                               multiline
                               fullWidth
                               value={equity.info}
                               onChange={e => dispatch(setEquity({...equity, info: e.target.value}))}
                    />
                    {selectedPhotos.length > 0 && <PhotoGallery images={selectedPhotos.map(f => f.url)}/>}
                </DialogContent>
                <DialogActions>
                    <PhotoUpload files={selectedPhotos} onFileUploaded={f => dispatch(addPhoto(f))}/>
                    <Button onClick={() => dispatch(toggleDialog(false))}>
                        Отменить
                    </Button>
                    <Button onClick={() => {dispatch(saveEquity(equity))}} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>

            </Dialog>
        </div>
    )
}

function SelectDirectory(props) {
    return (
        <Autocomplete
            options={props.options}
            value={props.value}
            autoHighlight
            autoComplete
            disableOpenOnFocus
            getOptionLabel={a => a && a !== '' ? a.name : ''}
            renderInput={params => (
                <TextField {...params} label={props.label} fullWidth/>
            )}
            filterOptions={(options, state) => options.filter(o => o.name.match(new RegExp("^" + state.inputValue, "i")))}
            onChange={props.onChange}
        />
    )
}

function SelectStreet(props) {
    return (<Autocomplete
            options={props.options}
            value={props.value}
            inputValue={props.inputValue}
            autoHighlight
            autoComplete
            disableOpenOnFocus
            // getOptionLabel={a => (a.type ? a.type : '') + ' ' + a.name}
            renderInput={params => (
                <TextField {...params} label={props.label} required  error={props.error} helperText={props.helperText} fullWidth/>
            )}
            onInputChange={props.onInputChange}
            onChange={props.onChange}
        />
    )
}