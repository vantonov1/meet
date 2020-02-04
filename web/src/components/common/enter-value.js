import {Dialog, DialogContent} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React from "react";

export default function EnterValue(props) {
    const {open, onCancel, onOk} = props;
    return <Dialog open={open} maxWidth="xs">
        <DialogContent>
            {props.children}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => onCancel()}>
                Отменить
            </Button>
            <Button onClick={() => onOk()} color="primary">
                Сохранить
            </Button>
        </DialogActions>
    </Dialog>
}