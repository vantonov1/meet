import React from "react";
import OkCancelDialog from "../common/ok-cancel-dialog";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {createComment, setRate, setShared, setText, showCreateComment} from "./slice";
import {FormControlLabel, TextField} from "@material-ui/core";
import {Rating} from "@material-ui/lab";
import Checkbox from "@material-ui/core/Checkbox";

export default function CreateComment(props) {
    const {request} = props;
    const {open, rate, text, shared} = useSelector(state => state.createComment, shallowEqual);
    const dispatch = useDispatch();

    return <OkCancelDialog open={open}
                       onCancel={() => dispatch(showCreateComment(false))}
                       onOk={() => {
                           dispatch(createComment(request, rate, text, shared));
                           dispatch(showCreateComment(false))
                       }}
    >
        <div>
            <Rating name = 'Дайте оценку' value={rate} onChange={(event, newValue) => dispatch(setRate(newValue))}/>
        </div>
        <TextField multiline fullWidth value={text} onChange={e => dispatch(setText(e.target.value))}/>
        <FormControlLabel control={<Checkbox value={shared} onChange={e => dispatch(setShared(e.target.checked))}/>} label="Поделиться с другими"/>
    </OkCancelDialog>


}