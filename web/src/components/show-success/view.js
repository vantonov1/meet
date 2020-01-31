import React from 'react';
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {useDispatch, useSelector} from "react-redux";
import {hideSuccess} from "./slice";

export default function Success() {
    const success = useSelector(state => state.success);
    const dispatch = useDispatch();
    return (
        <Snackbar open={success?.show} autoHideDuration={4000} onClose={() => dispatch(hideSuccess())}>
            <Alert severity="success">
                {success?.text}
            </Alert>
        </Snackbar>
    )
}
