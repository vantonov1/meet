import React from "react";
import {ListItem} from "@material-ui/core";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {saveRequest, setContacts, setName, showAgent, showCreateRequest} from "./slice";
import {CONTACT_TYPES} from "../common/constants";
import EditPersonContacts from "../common/edit-person-contacts";
import EnterValue from "../common/enter-value";
import ShowInfo from "../common/showInfo";

export default function CreateCustomerRequest() {
    const {open, name, contacts, agent} = useSelector(state => state.createRequest, shallowEqual);
    const dispatch = useDispatch();
    return <EnterValue open={open}
                       okDisabled={() => {return name === '' || contacts.length === 0 || contacts[0].contact === ''}}
                       onCancel={() => dispatch(showCreateRequest(false))}
                       onOk={() => {dispatch(saveRequest(name, contacts))}}
    >
        <EditPersonContacts name={name}
                                contacts={contacts}
                                onNameChanged={n => dispatch(setName(n))}
                                onContactsChanged={c => dispatch(setContacts(c))}
        />
        <ShowInfo open={agent != null} onOk={() => {
            dispatch(showAgent(null));
            dispatch(showCreateRequest(false))
        }}>
             <p>Ваш запрос отправлен агенту {agent?.name}</p>
             {agent?.contacts.map((c, i) => <ListItem key={i}>{CONTACT_TYPES[c.contactType].label}&nbsp;{c.contact}</ListItem>)}
        </ShowInfo>
    </EnterValue>
}