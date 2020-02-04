import React from "react";
import {DatePicker, MuiPickersUtilsProvider, TimePicker} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";

export default function EditDateTime(props) {
    const {value, onChange} = props;
    return <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
        <DatePicker
            fullWidth
            autoOk
            disablePast
            format="dd.MM.yy"
            margin="normal"
            label="Дата"
            value={value}
            onChange={e => onChange(e.toISOString())}
        />
        <TimePicker
            fullWidth
            autoOk
            ampm={false}
            margin="normal"
            label="Время"
            value={value}
            onChange={e => onChange(e.toISOString())}
        />
    </MuiPickersUtilsProvider>

}