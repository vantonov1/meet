import React, {useEffect} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {loadDistricts} from "./slice";
import SelectMany from "../common/select-many";

export default function SelectDistricts(props) {
    const {districts} = useSelector(state => state.selectDistricts, shallowEqual);
    const dispatch = useDispatch();

    useEffect(() => {
        if (districts.length === 0) {
            dispatch(loadDistricts(props.city))
        }
    });

    return (
        <SelectMany values={districts} onCancel={props.onCancel} onOk={props.onOk}/>
    );
}