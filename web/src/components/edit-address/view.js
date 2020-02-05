import React, {useEffect} from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {fetchStreets, loadDistricts, loadSubways, setAddress, setField} from "./slice";

export default function EditAddress(props) {
    const {address, districts, subways, streets, streetText} = useSelector(state => state.editAddress, shallowEqual);
    const {city, selectDistrict, selectSubway, validation, onChange} = props;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setAddress({...address, city: city}));
    }, [city]);

    useEffect(() => {
        if (selectDistrict && districts?.length === 0)
            dispatch(loadDistricts(city));
    }, [selectDistrict, districts, city]);

    useEffect(() => {
        if (selectSubway && subways?.length === 0)
            dispatch(loadSubways(city));
    }, [selectSubway, subways, city]);

    useEffect(() => {
        if (streetText && streets?.length === 0)
            dispatch(fetchStreets(city, streetText))
    }, [streetText, city]);

    return <>
        {selectDistrict && <SelectDirectory label="Район"
                                            options={districts}
                                            value={address.district}
                                            onChange={(e, v) => dispatch(setAddress({...address, district: v}))}
        />}
        {selectSubway && <SelectDirectory label="Станция метро"
                                          options={subways}
                                          value={address.subway}
                                          onChange={(e, v) => dispatch(setAddress({...address, subway: v}))}
        />}
        <SelectStreet label="Улица"
                      options={streets}
                      value={address.street}
                      error={validation.street?.error}
                      helperText={validation.street?.text}
                      inputValue={streetText ? streetText : ''}
                      onChange={(e, v) => {
                          let a = {...address, street: v ? v : ''};
                          onChange(a);
                          dispatch(setAddress(a));
                          dispatch(setField({name: "streetText", value: v}));
                          dispatch(setField({name: "streets", value: []}));
                      }}
                      onInputChange={e => {
                          if (e?.type === 'change') {
                              dispatch(setField({name: "streetText", value: e.target.value}));
                              dispatch(setField({name: "streets", value: []}))
                          }
                      }}
        />
        <TextField label="Дом"
                   value={address.building}
                   required error={validation.building?.error}
                   helperText={validation.building?.text}
                   onChange={e => {
                       let a = {...address, building: e.target.value};
                       onChange(a);
                       dispatch(setAddress(a));
                   }}
        />
    </>
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