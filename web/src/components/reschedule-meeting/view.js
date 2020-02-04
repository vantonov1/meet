import React, {useEffect} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {saveMeeting, setDate, showRescheduleMeeting} from "./slice";
import EditDateTime from "../common/edit-datetime";
import EnterValue from "../common/enter-value";

export default function RescheduleMeeting(props) {
    const {open, date} = useSelector(state => state.rescheduleMeeting, shallowEqual);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setDate(props.meeting?.schedule))
    }, [props.meeting?.schedule]);

    return <EnterValue open={open}
                       onCancel={() => dispatch(showRescheduleMeeting(false))}
                       onOk={() => dispatch(saveMeeting(props.meeting, date))}>
        <EditDateTime value={date} onChange={e => dispatch(setDate(e))}/>
    </EnterValue>
}