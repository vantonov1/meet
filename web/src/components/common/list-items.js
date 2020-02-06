import React from "react";
import {ListItem} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ListItemText from "@material-ui/core/ListItemText";
import {CONTACT_TYPES, EQUITY_TYPES, isSale} from "./constants";
import parse from 'date-fns/parseISO'
import format from 'date-fns/format'
import isToday from 'date-fns/isToday'
import isTomorrow from "date-fns/isTomorrow";

const useStyles = makeStyles(theme => ({
    item: {cursor: "pointer"},
    meetingRoot: {cursor: "pointer", display: 'flex'},
    requestItem: {cursor: "pointer", display: 'flex', flexDirection: 'column'},
    justify: {display: "flex", justifyContent: "space-between", whiteSpace: 'nowrap'}
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
    const {equity, buyer, seller, meeting, selected, onClick} = props;
    const classes = useStyles();
    return <ListItem className={classes.requestItem} divider selected={selected} onClick={onClick}>
        {equity && <Box width={1} className={classes.justify}><Equity equity={equity}/>{meeting ? <span>Встреча: {parseMeeting(meeting)}</span> :''}</Box>}
        {buyer && <Box width={1}>{isSale(equity) ? 'Покупатель': 'Арендатор'}: {buyer.name} <Contacts person={buyer}/></Box>}
        {seller && <Box width={1}>{isSale(equity) ? 'Продавец' : 'Арендодатель'}: {seller.name} <Contacts person={seller}/></Box>}
        {equity && <Box width={1} className="MuiTypography-colorTextSecondary MuiTypography-body2">
            {EQUITY_TYPES[equity.type]}
        </Box>}
    </ListItem>;
}

export function MeetingListItem(props) {
    const {equity, person, selected, schedule, onClick} = props;
    const classes = useStyles();

    return <ListItem className={classes.meetingRoot}
                     divider
                     selected={selected}
                     onClick={onClick}>
        <ListItemText secondary={equity && EQUITY_TYPES[equity.type]}>
            {equity && <Box width={1} className={classes.justify}><Equity equity={equity}/><span>Встреча: {parseMeeting(schedule)}</span></Box>}
            {person && <span>{person.name}</span>}
            {person && <Contacts person={person}/>}
        </ListItemText>
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

function parseMeeting(meeting) {
    let date = parse(meeting);
    return meeting
        ? isToday(date) ? 'cегодня в ' + format(date, 'HH:mm')
            : isTomorrow(date) ? 'завтра в ' + format(date, 'HH:mm')
                : format(date, 'dd.MM.yy HH:ss')
        : '';
}

