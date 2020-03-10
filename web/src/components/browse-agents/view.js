import React, {useState} from "react";
import {inviteAdmin, loadAgents, selectAgent, setInvitation} from "./slice";
import {TableBody, TableCell, TableRow} from "@material-ui/core";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import Fab from "@material-ui/core/Fab";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AddIcon from "@material-ui/icons/Add";
import {Invite} from "../common/invite";
import Browse from "../common/abstract-browser";
import Table from "@material-ui/core/Table";
import {Contacts} from "../common/contacts";
import TableHead from "@material-ui/core/TableHead";
import {CITY} from "../common/constants";

const useStyles = makeStyles(theme => ({
    invite: {
        position: 'fixed',
        right: theme.spacing(1),
        top: theme.spacing(2) + theme.mixins.toolbar.minHeight
    },
}));

export default function BrowseAgents() {
    const {records, selected, invitation} = useSelector(state => state.browseAgents, shallowEqual);
    const [showInvite, setShowInvite] = useState(false);
    const dispatch = useDispatch();
    const classes = useStyles();

    return <>
        <Browse slice="browseAgents" loader={loadAgents} title="Агенты">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Имя</TableCell>
                        <TableCell>Контакты</TableCell>
                        <TableCell>Город</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {records.map(r =>
                        <TableRow key={r.id}
                                  selected={r === selected}
                                  style={{cursor: 'pointer'}}
                                  onClick={() => dispatch(selectAgent(r))}>
                            <TableCell>{r.name}</TableCell>
                            <TableCell><Contacts person={r}/></TableCell>
                            <TableCell>{CITY[r.city]}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Browse>
        <Fab variant="extended" color="primary" className={classes.invite} onClick={() => setShowInvite(true)}>
            <AddIcon/>
            Добавить агента
        </Fab>
        <Invite page="agent"
                open={showInvite}
                invitation={invitation}
                onEmail={(email) => dispatch(inviteAdmin(email))}
                onCancel={() => setShowInvite(false)}
                onOk={() => {
                    dispatch(setInvitation(null));
                    setShowInvite(false)
                }}/>
    </>
}