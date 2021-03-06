import React from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {registerAgent, setContacts, setName} from "./slice";
import EditPersonContacts from "../common/edit-person-contacts";
import EnterValue from "../common/enter-value";

export default function RegisterAgent() {
    const {name, contacts} = useSelector(state => state.createAgent, shallowEqual);
    const dispatch = useDispatch();

    return <EnterValue open={true}
                       okDisabled={() => {return name === '' || contacts.length === 0 || contacts[0].contact === ''}}
                       onCancel={() => window.history.back()}
                       onOk={() => dispatch(registerAgent(name, contacts))}
    >
        <EditPersonContacts name={name}
                            contacts={contacts}
                            onNameChanged={n => dispatch(setName(n))}
                            onContactsChanged={c => dispatch(setContacts(c))}
        />
    </EnterValue>
}