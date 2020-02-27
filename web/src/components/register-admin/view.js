import React, {useEffect} from "react";
import {CircularProgress} from "@material-ui/core";
import AdminAPI from "../../api/AdminAPI";
import {useDispatch} from "react-redux";
import {showError} from "../show-error/slice";

export function getInvitation() {
    let params = window.location.hash.indexOf('?');
    if (params !== -1) {
        return new URLSearchParams(window.location.hash.slice(params + 1)).get("invitation");
    } else
        return null;
}

export default function RegisterAdmin() {
    const dispatch = useDispatch();
    useEffect(() => {
        let invitation = getInvitation();
        if(invitation != null) {
            AdminAPI.register(invitation).then(() => {
                window.location.href = window.location.origin + '/#/admin'
            }).catch((reason) => dispatch(showError(reason.message)))
        }
    });
    return <CircularProgress/>

}