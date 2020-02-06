import React from "react";
import Browse from "./abstract-browser";
import {List} from "@material-ui/core";

export default function BrowseList(props) {
    const {children, ...other} = props;
    return <Browse {...other}>
        <List style={{width: '100%'}}>
            {children}
        </List>
    </Browse>
}