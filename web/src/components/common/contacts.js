import React from "react";
import {CONTACT_TYPES} from "./constants";

export function Contacts(props) {
    const {person} = props;
    return person.contacts? person.contacts.map(c => <span key={c.contactType + c.contact}>
                &nbsp;{CONTACT_TYPES[c.contactType].label}&nbsp;{c.contact}
            </span>)
        : <span/>;
}

