import React from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {saveRequest, setContacts, setName, showAgent, showCreateRequest} from "./slice";
import EditPersonContacts from "../common/edit-person-contacts";
import OkCancelDialog from "../common/ok-cancel-dialog";
import ShowInfo from "../common/showInfo";
import {Contacts} from "../common/contacts";

export default function CreateCustomerRequest() {
    const {open, name, contacts, agent, customerId} = useSelector(state => state.createRequest, shallowEqual);
    const dispatch = useDispatch();

    return <>
        <OkCancelDialog open={open && customerId == null}
                    okDisabled={() => {
                        return name === '' || contacts.length === 0 || contacts[0].contact === ''
                    }}
                    onCancel={() => dispatch(showCreateRequest(false))}
                    onOk={() => {
                        dispatch(saveRequest(name, contacts))
                    }}
        >
            <EditPersonContacts name={name}
                                contacts={contacts}
                                onNameChanged={n => dispatch(setName(n))}
                                onContactsChanged={c => dispatch(setContacts(c))}
            />
        </OkCancelDialog>
        <ShowInfo open={agent != null} onOk={() => {
            dispatch(showAgent(null));
            dispatch(showCreateRequest(false))
        }}>
            <p>Ваш запрос отправлен агенту {agent?.name}</p>
            {agent ? <Contacts person={agent}/> : ''}
        </ShowInfo>
    </>
}