import {DialogContent} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React from "react";
import ResponsiveXsDialog from "./responsive-xs-dialog";

export default function OkCancelDialog(props) {
    const {open, okDisabled, onCancel, onOk} = props;
    return <ResponsiveXsDialog open={open}>
        <DialogContent>
            {props.children}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => onCancel()}>
                Отменить
            </Button>
            <Button onClick={() => onOk()} color="primary"  disabled={okDisabled ? okDisabled() : false}>
                Сохранить
            </Button>
        </DialogActions>
    </ResponsiveXsDialog>
}