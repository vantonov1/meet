import React from "react";
import {Dialog, DialogContent, ListItem} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {saveRequest, setContacts, setName, showAgent, showCreateRequest} from "./slice";
import {CONTACT_TYPES} from "../common/constants";
import EditPersonContacts from "../common/edit-person-contacts";

export default function CreateCustomerRequest(props) {
    const {open, name, contacts, agent} = useSelector(state => state.createRequest, shallowEqual);
    const dispatch = useDispatch();
    return <Dialog disableBackdropClick
                   disableEscapeKeyDown
                   maxWidth="xs"
                   open={open}>
        <EditPersonContacts name={name}
                            contacts={contacts}
                            onNameChanged={n => dispatch(setName(n))}
                            onContactsChanged={c => dispatch(setContacts(c))}
        />
        <DialogActions>
            <Button onClick={() => dispatch(showCreateRequest(false))}>
                Отменить
            </Button>
            <Button onClick={() => {
                dispatch(saveRequest(name, contacts))
            }} disabled={name === '' || contacts.length === 0 || contacts[0].contact === ''} color="primary">
                Сохранить
            </Button>
        </DialogActions>
        <Dialog open={agent != null}>
            <DialogContent>
                <p>Ваш запрос отправлен агенту {agent?.name}</p>
                {agent?.contacts.map((c, i) => <ListItem
                    key={i}>{CONTACT_TYPES[c.contactType].label}&nbsp;{c.contact}</ListItem>)}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    dispatch(showAgent(null));
                    dispatch(showCreateRequest(false))
                }} color="primary">
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    </Dialog>
}