import React, {useEffect} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {saveRequest, saveRequestFromKnownCustomer, setContacts, setName, showAgent, showCreateRequest} from "./slice";
import EditPersonContacts from "../common/edit-person-contacts";
import EnterValue from "../common/enter-value";
import ShowInfo from "../common/showInfo";
import {Contacts} from "../common/contacts";

export default function CreateCustomerRequest() {
    const {open, name, contacts, agent, customerId} = useSelector(state => state.createRequest, shallowEqual);
    const dispatch = useDispatch();

    useEffect(() => {
       if(customerId)
           dispatch(saveRequestFromKnownCustomer(customerId))
    }, [customerId]);

    return <EnterValue open={open && customerId == null}
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
             {agent? <Contacts person={agent}/> : ''}
        </ShowInfo>
    </EnterValue>
}