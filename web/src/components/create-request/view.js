import React from "react";
import {Dialog, DialogContent, ListItem} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {saveRequest, setContacts, setName, showAgent} from "./slice";
import {CONTACT_TYPES} from "../common/constants";
import EditPersonContacts from "../common/edit-person-contacts";

export default function CreateCustomer(props) {
    const {name, contacts, contactType, contact, agent} = useSelector(state => state.createRequest, shallowEqual);
    const dispatch = useDispatch();
    return <Dialog disableBackdropClick
                   disableEscapeKeyDown
                   maxWidth="xs"
                   open={props.open}>
        <EditPersonContacts name={name}
                            contacts={contacts}
                            onNameChanged={n => dispatch(setName(n))}
                            onContactsChanged={c => dispatch(setContacts(c))}
        />
        <DialogActions>
            <Button onClick={() => props.onClose()}>
                Отменить
            </Button>
            <Button onClick={() => {
                if (contact.length > 0) {
                    dispatch(saveRequest(name, [...contacts, {contactType: contactType, contact: contact}]));
                } else
                    dispatch(saveRequest(name, contacts))
            }} color="primary">
                Сохранить
            </Button>
        </DialogActions>
        <Dialog open={agent != null}>
            <DialogContent>
                <p>Ваш запрос отправлен агенту {agent?.name}</p>
                {agent?.contacts.map(c => <ListItem>{CONTACT_TYPES[c.contactType].label}&nbsp;{c.contact}</ListItem>)}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    dispatch(showAgent(null));
                    props.onClose()
                }} color="primary">
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    </Dialog>
}