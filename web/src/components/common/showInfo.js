import {DialogContent} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React from "react";
import ResponsiveXsDialog from "./responsive-xs-dialog";

export default function ShowInfo(props) {
    const {open, onOk} = props;
    return <ResponsiveXsDialog open={open}>
        <DialogContent>
            {props.children}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => onOk()} color="primary">
                OK
            </Button>
        </DialogActions>
    </ResponsiveXsDialog>
}