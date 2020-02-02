import React from "react";
import {ListItem} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ListItemText from "@material-ui/core/ListItemText";
import {CONTACT_TYPES, EQUITY_TYPES, isSale} from "./constants";

const useStyles = makeStyles(theme => ({
    item: {cursor: "pointer", display: "contents"}
}));

export function RequestListItem(props) {
    const {equity, person, selected, onClick} = props;
    const classes = useStyles();

    return <ListItem className={classes.item}
                     divider
                     selected={selected}
                     onClick={onClick}>
        <ListItemText secondary={equity && EQUITY_TYPES[equity.type]}>
            {equity && <Equity equity={equity}/>}
            {person && <span>{person.name}</span>}
            {person && <Contacts person={person}/>}
        </ListItemText>
    </ListItem>;
}

export function MergedRequestListItem(props) {
    const {equity, buyer, seller, selected, onClick} = props;
    const classes = useStyles();

    return <ListItem className={classes.item}
                     divider
                     selected={selected}
                     onClick={onClick}>
            {equity && <Equity equity={equity}/>}
            {buyer && <Box width={1}>{isSale(equity) ? 'Покупатель': 'Арендатор'}: {buyer.name} <Contacts person={buyer}/></Box>}
            {seller && <Box width={1}>{isSale(equity) ? 'Продавец' : 'Арендодатель'}: {seller.name} <Contacts person={seller}/></Box>}
            {equity && <Box width={1} className="MuiTypography-colorTextSecondary MuiTypography-body2">
                {EQUITY_TYPES[equity.type]}
            </Box>}
    </ListItem>;
}

function Equity(props) {
    const {equity} = props;
    return <Box width={1}><b>{equity.price}&#8381;</b>&nbsp;{equity.address.street}&nbsp;{equity.address.building}</Box>;
}

function Contacts(props) {
    const {person} = props;
    return person.contacts?.map(c => <span key={c.contactType + c.contact}>
                &nbsp;{CONTACT_TYPES[c.contactType].label}&nbsp;{c.contact}
            </span>);
}

