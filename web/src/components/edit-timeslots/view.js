import React, {useEffect} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {MenuItem, Table, TextField} from "@material-ui/core";
import {MuiPickersUtilsProvider, TimePicker} from "@material-ui/pickers";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import {addTimeSlot, loadTimeSlots, saveTimeSlots, setTimeSlot, showEditTimeSlots} from './slice'
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import parse from 'date-fns/parse'
import TableHead from "@material-ui/core/TableHead";
import EnterValue from "../common/enter-value";

const DAYS_OF_WEEK = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

function parseTime(t) {
    return parse(t, "HH:mm", Date.now());
}

export default function EditTimeSlots(props) {
    const {open, records, timeSlot} = useSelector(state => state.editTimeSlots, shallowEqual);
    const {request} = props;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadTimeSlots(request))
    }, [request]);

    return <EnterValue open={open} onCancel={() => showEditTimeSlots(false)} onOk={() => {
        dispatch(saveTimeSlots(records, request))
    }}>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
            <div style={{display: 'flex', flexFlow: 'row nowrap'}}>
                <Table style={{width: 300}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TextField className="MuiFormControl-marginNormal" style={{width: 70}}
                                           select
                                           value={timeSlot.dayOfWeek}
                                           onChange={e => dispatch(setTimeSlot({...timeSlot, dayOfWeek: e.target.value}))}
                                >
                                    {DAYS_OF_WEEK.map((d, i) => <MenuItem key={i} value={d}>{d}</MenuItem>)}
                                </TextField>
                            </TableCell>
                            <TableCell>
                                <TimePicker autoOk ampm={false} margin="normal" value={parseTime(timeSlot.minTime)}
                                            onChange={e => dispatch(setTimeSlot({...timeSlot, minTime: e.toISOString()}))}
                                />
                            </TableCell>
                            <TableCell>
                                <TimePicker autoOk ampm={false} margin="normal" value={parseTime(timeSlot.maxTime)}
                                            onChange={e => dispatch(setTimeSlot({...timeSlot, maxTime: e.toISOString()}))}
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.map((d, i) =>
                            <TableRow key={i}>
                                <TableCell size="small" component="th" scope="row">{d.dayOfWeek}</TableCell>
                                <TableCell size="small" align="left">{d.minTime}</TableCell>
                                <TableCell size="small" align="left">{d.maxTime}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="MuiTableCell-head">
                    <Button variant="contained" color="primary" className='MuiFormControl-marginNormal'
                            onClick={() => dispatch(addTimeSlot(timeSlot))}>Добавить</Button>
                </div>
            </div>
        </MuiPickersUtilsProvider>
    </EnterValue>
}