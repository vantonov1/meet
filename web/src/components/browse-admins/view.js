import React, {useState} from "react";
import BrowseList from "../common/browse-list";
import {inviteAdmin, loadAdmins, selectAdmin, setInvitation} from "./slice";
import {ListItem} from "@material-ui/core";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import Fab from "@material-ui/core/Fab";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AddIcon from "@material-ui/icons/Add";
import {Invite} from "../common/invite";

const useStyles = makeStyles(theme => ({
    invite: {
        position: 'fixed',
        right: theme.spacing(1),
        top: theme.spacing(2) + theme.mixins.toolbar.minHeight
    },
}));

export default function BrowseAdministrators() {
    const {records, selected, invitation} = useSelector(state => state.browseAdmin, shallowEqual);
    const [showInvite, setShowInvite] = useState(false);
    const dispatch = useDispatch();
    const classes = useStyles();

    return <>
        <BrowseList slice="browseAdmin" loader={loadAdmins} title="Администраторы">
            {records.map(r => <ListItem key={r}
                                        selected={r === selected}
                                        style={{cursor: 'pointer'}}
                                        onClick={() => dispatch(selectAdmin(r))}>{r}</ListItem>)
            }
            <Fab variant="extended" color="primary" className={classes.invite} onClick={() => setShowInvite(true)}>
                <AddIcon/>
                Добавить администратора
            </Fab>
        </BrowseList>
        <Invite page="admin"
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
