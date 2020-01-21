import React, {useEffect} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {loadSubways} from "./slice";
import SelectMany from "../common/select-many";

export default function SelectSubways(props) {
    const {subways} = useSelector(state => state.selectSubways, shallowEqual);
    const dispatch = useDispatch();

    useEffect(() => {
        if (subways.length === 0) {
            dispatch(loadSubways(props.city))
        }
    });

    return (
        <SelectMany values={subways} onCancel={props.onCancel} onOk={props.onOk}/>
    );
}