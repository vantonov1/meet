import React from "react";
import EnterValue from "../common/enter-value";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {createComment, setRate, setText, showCreateComment} from "./slice";
import {TextField} from "@material-ui/core";
import {Rating} from "@material-ui/lab";

export default function CreateComment(props) {
    const {request} = props;
    const {open, rate, text} = useSelector(state => state.createComment, shallowEqual);
    const dispatch = useDispatch();

    return <EnterValue open={open}
                       onCancel={() => dispatch(showCreateComment(false))}
                       onOk={() => {
                           dispatch(createComment(request, rate, text));
                           dispatch(showCreateComment(false))
                       }}
    >
        <div>
            <Rating name = 'Дайте оценку' value={rate} onChange={(event, newValue) => dispatch(setRate(newValue))}/>
        </div>
        <TextField multiline value={text} onChange={e => dispatch(setText(e.target.value))}/>
    </EnterValue>


}