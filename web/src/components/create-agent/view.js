import React from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {saveAgent, setContacts, setName, showCreateAgent} from "./slice";
import EditPersonContacts from "../common/edit-person-contacts";
import EnterValue from "../common/enter-value";

export default function CreateAgent(props) {
    const {open, name, contacts} = useSelector(state => state.createAgent, shallowEqual);
    const dispatch = useDispatch();

    return <EnterValue open={open}
                       okDisabled={() => {return name === '' || contacts.length === 0 || contacts[0].contact === ''}}
                       onCancel={() =>dispatch(showCreateAgent(false))}
                       onOk={() => dispatch(saveAgent(name, contacts))}
    >
        <EditPersonContacts name={name}
                            contacts={contacts}
                            onNameChanged={n => dispatch(setName(n))}
                            onContactsChanged={c => dispatch(setContacts(c))}
        />
    </EnterValue>
}