import DialogContent from "@material-ui/core/DialogContent";
import {MenuItem, Select} from "@material-ui/core";
import {TYPES} from "../common/equity-types";
import TextField from "@material-ui/core/TextField";
import PhotoGallery from "../common/photo-gallery";
import React from "react";
import {getSelectedFiles} from "../common/photo-upload";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function EditEquityContent(props) {
    const {equity, districts, subways, validation, streets, streetText, onFieldChange, onEquityFieldChange} = props;
    const selectedFiles = getSelectedFiles();

    return <DialogContent>
        <Select label="Тип"
                required
                value={equity.type ? equity.type : props.type}
                fullWidth
                onChange={e => onEquityFieldChange({name: "type", value: e.target.value})}>
            {Object.entries(TYPES).map(k => <MenuItem key={k[0]} value={k[0]}>{k[1]}</MenuItem>)}
        </Select>
        <SelectDirectory label="Район"
                         options={districts}
                         value={equity.district}
                         onChange={(e, v) => onEquityFieldChange({name: "address", value: {...equity.address, district: v}})}
        />
        <SelectDirectory label="Станция метро"
                         options={subways}
                         value={equity.subway}
                         onChange={(e, v) => onEquityFieldChange({name: "address", value: {...equity.address, subway: v}})}
        />
        <SelectStreet label="Улица"
                      options={streets}
                      value={equity.street}
                      error={validation.street?.error}
                      helperText={validation.street?.text}
                      inputValue={streetText}
                      onChange={(e, v) => {
                          onEquityFieldChange({name: "address", value: {...equity.address, street: v}});
                          onFieldChange({name: "streets", value: []})
                      }}
                      onInputChange={e => {
                          if (e?.type === 'change') {
                              onFieldChange({name: "streetText", value: e.target.value});
                              onFieldChange({name: "streets", value: []})
                          }
                      }}
        />
        <TextField label="Дом"
                   value={equity.building}
                   onChange={e => onEquityFieldChange({name: "address", value: {...equity.address, building: e.target.value}})}
        />
        <TextField label="Цена"
                   type="number"
                   required error={validation.price?.error} helperText={validation.price?.text}
                   inputProps={{inputMode: 'decimal', step: 100000}}
                   value={equity.price}
                   onChange={e => onEquityFieldChange({name: "price", value: e.target.value})}
        />
        <TextField label="Площадь"
                   type="number"
                   required error={validation.square?.error} helperText={validation.square?.text}
                   inputProps={{inputMode: 'decimal'}}
                   value={equity.square}
                   onChange={e => onEquityFieldChange({name: "square", value: e.target.value})}
        />
        <TextField label="Количество комнат"
                   type="number"
                   inputProps={{inputMode: 'decimal'}}
                   value={equity.rooms}
                   onChange={e => onEquityFieldChange({name: "rooms", value: e.target.value})}
        />
        <TextField label="Дополнительная информация"
                   multiline
                   fullWidth
                   value={equity.info}
                   onChange={e => onEquityFieldChange({name: "info", value: e.target.value})}
        />
        {selectedFiles.length > 0 && <PhotoGallery images={selectedFiles.map(f => f.url)}/>}
    </DialogContent>

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
                <TextField {...params} label={props.label} required error={props.error} helperText={props.helperText}
                           fullWidth/>
            )}
            onInputChange={props.onInputChange}
            onChange={props.onChange}
        />
    )
}