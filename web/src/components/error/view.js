import React from 'react';
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {useDispatch, useSelector} from "react-redux";
import {hide} from "./slice";

export default function Error() {
    const error = useSelector(state => state.error);
    const dispatch = useDispatch();
    return (
        <Snackbar open={error?.show} autoHideDuration={4000} onClose={() => dispatch(hide())}>
            <Alert severity="error">
                {error?.reason}
            </Alert>
        </Snackbar>
    )
}
