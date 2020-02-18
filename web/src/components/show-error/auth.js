import React, {useEffect} from "react";
import "firebaseui/dist/firebaseui.css"
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {Dialog, DialogContent} from "@material-ui/core";
import {showAuth} from "../../api/FirebaseAPI";

export default function Auth() {
    const {needAuth} = useSelector(state => state.error, shallowEqual);
    const dispatch = useDispatch();
    useEffect(() => {
        if (needAuth)
            showAuth()
    }, [needAuth]);

    return <Dialog open={needAuth} transitionDuration={0}>
        <DialogContent>
            <div id="firebaseui-auth-container"/>
        </DialogContent>
    </Dialog>
}