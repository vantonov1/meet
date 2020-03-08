import {Dialog, useMediaQuery} from "@material-ui/core";
import React from "react";

export default function ResponsiveXsDialog(props) {
    const largeScreen = useMediaQuery(theme => theme.breakpoints.up('sm'));
    return largeScreen
        ? <Dialog maxWidth="sm" {...props}>{props.children}</Dialog>
        : <Dialog fullScreen {...props}>{props.children}</Dialog>

}