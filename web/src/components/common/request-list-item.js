import {ListItem} from "@material-ui/core";
import {CONTACT_TYPES, EQUITY_TYPES} from "./constants";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    item: {cursor: "pointer"}
}));

export function RequestListItem(props) {
    const {equity, person, selected, onClick} = props;
    const classes = useStyles();

    return <ListItem className={classes.item} divider secondary={equity && EQUITY_TYPES[equity.type]} selected={selected} onClick={onClick}>
        {equity &&
        <Box width={1}><b>{equity.price}&#8381;</b>&nbsp;{equity.address.street}&nbsp;{equity.address.building}</Box>}
        {person && <Typography>{person.name}</Typography>}
        {person && person.contacts?.map(c => <Typography key={c.contactType + c.contact}>
            &nbsp;{CONTACT_TYPES[c.contactType].label}&nbsp;{c.contact}
        </Typography>)}
    </ListItem>;
}