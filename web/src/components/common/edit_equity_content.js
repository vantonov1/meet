import {MenuItem, Select} from "@material-ui/core";
import {EQUITY_TYPES} from "./constants";
import TextField from "@material-ui/core/TextField";
import PhotoGallery from "./photo-gallery";
import React from "react";
import {getSelectedFiles} from "./photo-upload";
import EditAddress from "../edit-address/view";

export default function EditEquityContent(props) {
    const {type, equity, validation, onEquityFieldChange, onSelectLocation} = props;
    const selectedFiles = getSelectedFiles();

    return <>
        <Select label="Тип"
                required
                value={equity.type ? equity.type : type}
                fullWidth
                onChange={e => onEquityFieldChange({name: "type", value: e.target.value})}>
            {Object.entries(EQUITY_TYPES).map(k => <MenuItem key={k[0]} value={k[0]}>{k[1]}</MenuItem>)}
        </Select>
        <EditAddress initialAddress={equity.address}
                     validation={validation}
                     selectDistrict={true}
                     selectSubway={true}
                     onSelectLocation={onSelectLocation}
                     onChange={a => onEquityFieldChange({name: "address", value: a})}
        />
        <TextField label="Цена"
                   type="number"
                   required error={validation.price?.error} helperText={validation.price?.text}
                   inputProps={{inputMode: 'decimal', step: 100000}}
                   value={equity.price}
                   style={{width: '50%'}}
                   onChange={e => onEquityFieldChange({name: "price", value: e.target.value})}
        />
        <TextField label="Площадь"
                   type="number"
                   required error={validation.square?.error} helperText={validation.square?.text}
                   inputProps={{inputMode: 'decimal'}}
                   value={equity.square}
                   style={{width: '50%'}}
                   onChange={e => onEquityFieldChange({name: "square", value: e.target.value})}
        />
        <TextField label="Количество комнат"
                   type="number"
                   inputProps={{inputMode: 'decimal'}}
                   value={equity.rooms}
                   style={{width: '50%'}}
                   onChange={e => onEquityFieldChange({name: "rooms", value: e.target.value})}
        />
        <TextField label="Дополнительная информация"
                   multiline
                   fullWidth
                   value={equity.info}
                   onChange={e => onEquityFieldChange({name: "info", value: e.target.value})}
        />
        {selectedFiles.length > 0 && <PhotoGallery images={selectedFiles.map(f => f.url)}/>}
    </>

}