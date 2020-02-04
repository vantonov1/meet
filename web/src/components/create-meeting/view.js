import React from "react";
import {TextField} from "@material-ui/core";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {saveMeeting, setComment, setDate, showCreateMeeting} from "./slice";
import EditDateTime from "../common/edit-datetime";
import EnterValue from "../common/enter-value";

export default function CreateMeeting(props) {
    const {open, date, comment} = useSelector(state => state.createMeeting, shallowEqual);
    const dispatch = useDispatch();

    return <EnterValue open={open}
                       onCancel={() => dispatch(showCreateMeeting(false))}
                       onOk={() => dispatch(saveMeeting(props.fromRequest, date, comment))}>
        <TextField autoFocus multiline fullWidth label="Комментарий" value={comment}
                   onChange={e => dispatch(setComment(e.target.value))}/>
        <EditDateTime value={date} onChange={e => dispatch(setDate(e))}/>
    </EnterValue>
}