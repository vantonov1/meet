import {Dialog, DialogContent} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React from "react";

export default function ShowInfo(props) {
    const {open, onOk} = props;
    return <Dialog open={open} maxWidth="xs">
        <DialogContent>
            {props.children}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => onOk()} color="primary">
                OK
            </Button>
        </DialogActions>
    </Dialog>
}