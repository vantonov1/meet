import React from "react";
import {ListItem} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ListItemText from "@material-ui/core/ListItemText";
import {EQUITY_TYPES, isSale} from "./constants";
import parse from 'date-fns/parseISO'
import format from 'date-fns/format'
import isToday from 'date-fns/isToday'
import isTomorrow from "date-fns/isTomorrow";
import {Contacts} from "./contacts";
import EquityRate from "./equity-rate";

const useStyles = makeStyles((theme) => ({
    item: {cursor: "pointer"},
    meetingRoot: {cursor: "pointer", display: 'flex'},
    requestItem: {cursor: "pointer", display: 'flex', flexDirection: 'column'},
    justify: {display: "flex", justifyContent: "space-between", whiteSpace: 'nowrap'},
    ack: {color: "lightgreen"}
}));

export function RequestListItem(props) {
    const {equity, comments} = props;

    if (comments.length > 0)
        return <SimpleRequestListItem {...props}
                                      secondary={comments.map(c => c.text).join('↵')}
                                      action={<EquityRate comments={comments}/>}
        />;
    else
        return <SimpleRequestListItem secondary={equity && EQUITY_TYPES[equity.type]} {...props}/>;
}

function SimpleRequestListItem(props) {
    const {equity, person, selected, secondary, action, onClick} = props;
    const classes = useStyles();
    return <ListItem className={classes.item} divider selected={selected}>
        <ListItemText secondary={secondary} onClick={onClick}>
            {equity && <Equity equity={equity}/>}
            {person && <span>{person.name}</span>}
            {person && <Contacts person={person}/>}
        </ListItemText>
        {action}
    </ListItem>;
}

const buyerName = equity => isSale(equity) ? 'Покупатель' : 'Арендатор';
const sellerName = equity => isSale(equity) ? 'Продавец' : 'Арендодатель';

export function MergedRequestListItem(props) {
    const {equity, buyer, seller, meeting, selected, onClick} = props;
    const classes = useStyles();
    return <ListItem className={classes.requestItem} divider selected={selected} onClick={onClick}>
        {equity && <Box width={1} className={classes.justify}><Equity equity={equity}/>{meeting ?
            <span>Встреча: {parseMeeting(meeting)}</span> : ''}</Box>}
        {buyer &&
        <Box width={1}>{buyerName(equity)}: {buyer.name} <Contacts person={buyer}/></Box>}
        {seller &&
        <Box width={1}>{sellerName(equity)}: {seller.name} <Contacts person={seller}/></Box>}
        {equity && <Box width={1} className="MuiTypography-colorTextSecondary MuiTypography-body2">
            {EQUITY_TYPES[equity.type]}
        </Box>}
    </ListItem>;
}

export function MeetingListItem(props) {
    const {meeting, person, selected, onClick} = props;
    const {at, schedule, comment, acknowledgedBySeller, acknowledgedByBuyer} = meeting;
    const classes = useStyles();

    return <ListItem className={classes.meetingRoot}
                     divider
                     selected={selected}
                     onClick={onClick}>
        <ListItemText secondary={comment}>
            <Box width={1} className={classes.justify}>
                <Box>
                    {at && <Equity equity={at}/>}
                    {person && <span>{person.name}</span>}
                    {person && <Contacts person={person}/>}
                </Box>
                <Box>
                    <div>{parseMeeting(schedule)}</div>
                    {acknowledgedByBuyer  && <div><span className={classes.ack}>✓</span>&nbsp;{buyerName(at)}</div>}
                    {acknowledgedBySeller && <div><span className={classes.ack}>✓</span>&nbsp;{sellerName(at)}</div>}
                </Box>
            </Box>
        </ListItemText>
    </ListItem>;
}


function Equity(props) {
    const {equity} = props;
    return <Box width={1}><b>{equity.price}&#8381;</b>&nbsp;{equity.address.street}&nbsp;{equity.address.building}
    </Box>;
}

function parseMeeting(meeting) {
    let date = parse(meeting);
    return meeting
        ? isToday(date) ? 'cегодня в ' + format(date, 'HH:mm')
            : isTomorrow(date) ? 'завтра в ' + format(date, 'HH:mm')
                : format(date, 'dd.MM.yy HH:ss')
        : '';
}

