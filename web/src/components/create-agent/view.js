import React, {useLayoutEffect} from "react";
import {Dialog} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {saveAgent, setContacts, setName, setSaveFinished} from "./slice";
import EditPersonContacts from "../common/edit-person-contacts";

export default function CreateAgent(props) {
    const {name, contacts, saveFinished} = useSelector(state => state.createAgent, shallowEqual);
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        if(saveFinished) {
            props.onClose();
            dispatch(setSaveFinished(false))
        }
    }, [saveFinished]);

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
                dispatch(saveAgent(name, contacts))
            }} color="primary">
                Сохранить
            </Button>
        </DialogActions>
    </Dialog>
}