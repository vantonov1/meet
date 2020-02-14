import React, {useEffect} from "react";
import {CircularProgress} from "@material-ui/core";
import AdminAPI from "../../api/AdminAPI";
import {useDispatch} from "react-redux";
import {showError} from "../show-error/slice";

export default function RegisterAdmin() {
    const dispatch = useDispatch();
    useEffect(() => {
        register().then(r => {
            window.location.href = window.location.origin + '/admin'
        }).catch((reason) => dispatch(showError(reason.message)))
     });
    return <CircularProgress/>

}

const register = async () => {
    let invitation = window.location.search.replace("\?invitation=", "");
    await AdminAPI.register(invitation);
};
