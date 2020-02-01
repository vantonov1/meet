import React from "react";
import {Dialog} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {saveAgent, setContacts, setName} from "./slice";
import EditPersonContacts from "../common/edit-person-contacts";

export default function CreateAgent(props) {
    const {open, name, contacts} = useSelector(state => state.createAgent, shallowEqual);
    const dispatch = useDispatch();

    return <Dialog maxWidth="xs" open={open}>
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
                dispatch(saveAgent(name, contacts))
            }} disabled={name === '' || contacts.length === 0 || contacts[0].contact === ''} color="primary">
                Сохранить
            </Button>
        </DialogActions>
    </Dialog>
}