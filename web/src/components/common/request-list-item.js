import React from "react";
import {ListItem} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ListItemText from "@material-ui/core/ListItemText";
import {CONTACT_TYPES, EQUITY_TYPES} from "./constants";

const useStyles = makeStyles(theme => ({
    item: {cursor: "pointer"}
}));

export function RequestListItem(props) {
    const {equity, person, selected, onClick} = props;
    const classes = useStyles();

    return <ListItem className={classes.item}
                     divider
                     selected={selected}
                     onClick={onClick}>
        <ListItemText secondary={equity && EQUITY_TYPES[equity.type]}>
            {equity && <Box width={1}><b>{equity.price}&#8381;</b>&nbsp;{equity.address.street}&nbsp;{equity.address.building}</Box>}
            {person && <span>{person.name}</span>}
            {person && person.contacts?.map(c => <span key={c.contactType + c.contact}>
                &nbsp;{CONTACT_TYPES[c.contactType].label}&nbsp;{c.contact}
            </span>)}
        </ListItemText>
    </ListItem>;
}