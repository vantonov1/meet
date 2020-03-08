import {DialogContentText} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ResponsiveXsDialog from "./responsive-xs-dialog";

const useStyles = makeStyles(theme => ({
    text: {margin: theme.spacing(4)}
}));

export default function ConfirmAction(props) {
    const classes = useStyles();
    return <ResponsiveXsDialog open={props.open}>
        <DialogContentText className={classes.text}>{props.text}</DialogContentText>
        <DialogActions>
            <Button onClick={() => props.onCancel()}>
                Отменить
            </Button>
            <Button onClick={() => {
                props.onOK()
            }} color="primary">
                OK
            </Button>
        </DialogActions>
    </ResponsiveXsDialog>

}