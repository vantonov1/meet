import React from "react";
import {Dialog, DialogContent, TextField} from "@material-ui/core";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import DateFnsUtils from '@date-io/date-fns';
import {DateTimePicker, MuiPickersUtilsProvider,} from '@material-ui/pickers';
import {saveMeeting, setComment, setDate, showCreateMeeting} from "./slice";
import ruLocale from "date-fns/locale/ru";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export default function CreateMeeting(props) {
    const {open, date, comment} = useSelector(state => state.createMeeting, shallowEqual);
    const dispatch = useDispatch();

    return <Dialog open={open} maxWidth="xs">
        <DialogContent>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                <TextField autoFocus multiline fullWidth label="Комментарий" value={comment}
                           onChange={e => dispatch(setComment(e.target.value))}/>
                <DateTimePicker
                    fullWidth
                    autoOk
                    disablePast
                    variant="inline"
                    format="dd.MM.yy HH:mm"
                    margin="normal"
                    label="Время"
                    value={date}
                    onChange={e => {
                        dispatch(setDate(e.toISOString()))
                    }}
                />
            </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => dispatch(showCreateMeeting(false))}>
                Отменить
            </Button>
            <Button onClick={() => {
                dispatch(saveMeeting(props.fromRequest, date, comment))
            }} color="primary">
                Сохранить
            </Button>
        </DialogActions>

    </Dialog>
}