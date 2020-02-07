import React, {useEffect} from "react";
import {Table, TextField} from "@material-ui/core";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {collectTimeTable, saveMeeting, setComment, setDate, showCreateMeeting} from "./slice";
import EditDateTime from "../common/edit-datetime";
import EnterValue from "../common/enter-value";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'

export default function CreateMeeting(props) {
    const {open, date, comment, timeTable} = useSelector(state => state.createMeeting, shallowEqual);
    const {fromRequest} = props;
    const dispatch = useDispatch();

    useEffect(() => {
        if (open)
            dispatch(collectTimeTable(fromRequest))
    }, [open, fromRequest]);

    return <EnterValue open={open}
                       onCancel={() => dispatch(showCreateMeeting(false))}
                       onOk={() => dispatch(saveMeeting(fromRequest, date, comment))}>
        <TextField autoFocus multiline fullWidth label="Комментарий" value={comment}
                   onChange={e => dispatch(setComment(e.target.value))}/>
        <EditDateTime value={date} onChange={e => dispatch(setDate(e))}/>
        <Table size="small" stickyHeader style={{marginTop: 50}}>
            <TableHead>
                <TableRow>
                    <TableCell padding='none'>{'Дата'}</TableCell>
                    <TableCell padding='none'>{'Время'}</TableCell>
                    <TableCell padding='none'>{'Агент'}</TableCell>
                    <TableCell padding='none'>{'Продавец'}</TableCell>
                    <TableCell padding='none'>{'Покупатель'}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {timeTable.map((d, i) =>
                    <TableRow key={i}>
                        <TableCell padding='none' component="th" scope="row">{dayFromOffset(d.date)}</TableCell>
                        <TableCell padding='none' align="left" style={{whiteSpace: "nowrap"}}>{d.timeMin} - {d.timeMax}</TableCell>
                        <TableCell padding='none' style={{backgroundColor: d.agent != null && d.agent === false ? 'lightpink' : ''}}/>
                        <TableCell padding='none' style={{backgroundColor: d.seller ? 'lightgreen' : ''}}/>
                        <TableCell padding='none' style={{backgroundColor: d.buyer ? 'lightgreen' : ''}}/>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </EnterValue>
}

function dayFromOffset(offset) {
    switch (offset) {
        case 0: return 'Сегодня';
        case 1: return 'Завтра';
        default: return format(addDays(new Date(Date.now()), offset), "dd.MM");
    }
}