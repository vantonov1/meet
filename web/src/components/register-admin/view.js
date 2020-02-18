import React, {useEffect} from "react";
import {CircularProgress} from "@material-ui/core";
import AdminAPI from "../../api/AdminAPI";
import {useDispatch} from "react-redux";
import {showError} from "../show-error/slice";

export default function RegisterAdmin() {
    const dispatch = useDispatch();
    useEffect(() => {
        let invitation = new URLSearchParams(window.location.search).get("invitation");
        AdminAPI.register(invitation).then(() => {
            window.location.href = window.location.origin + '/admin'
        }).catch((reason) => dispatch(showError(reason.message)))
    });
    return <CircularProgress/>

}