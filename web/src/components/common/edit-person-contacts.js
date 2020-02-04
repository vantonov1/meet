import React from "react";
import {ListItem, TextField} from "@material-ui/core";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import FormLabel from "@material-ui/core/FormLabel";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import {CONTACT_TYPES} from "../common/constants";

const empty = {contactType: 'PHONE', contact: ''};

export default function EditPersonContacts(props) {
    const {name, onNameChanged, contacts, onContactsChanged} = props;
    const current = contacts.length > 0 ? contacts[contacts.length - 1] : empty;
    const {contactType, contact} = current;

    const onContactChanged = (c) => {
        if(contacts.length > 0)
            onContactsChanged([...contacts.slice(0, -1), c]);
        else
            onContactsChanged([c])
    };

    return <>
        <TextField label="Как к Вам обращаться?"
                   required
                   fullWidth
                   autoFocus
                   value={name}
                   onChange={e => onNameChanged(e.target.value)}
        />
        <FormLabel>Как с Вами связаться?</FormLabel>
        <List>
            {contacts.map((c, i) => <ListItem key={i}>{CONTACT_TYPES[c.contactType].label}&nbsp;{c.contact}</ListItem>)}
        </List>
        <RadioGroup name="contactType"
                    value={contactType}
                    onChange={e => onContactChanged({contactType: e.target.value, contact: contact})}>
            {Object.entries(CONTACT_TYPES).map(k =>
                <div key={k[0]} style={{display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between'}}>
                    <FormControlLabel
                        value={k[0]}
                        control={<Radio/>}
                        label={k[1].label}/>
                    <TextField
                        value={contact}
                        type={k[1].type}
                        style={{visibility: k[0] === contactType ? 'visible' : 'hidden'}}
                        onChange={e => onContactChanged({contactType: contactType, contact: (e.target.value)})}
                        inputProps={{inputMode: k[1].type}}
                    />
                </div>)}
        </RadioGroup>
        <Button color="primary" onClick={() => {
            onContactsChanged([...contacts, empty] )
        }}>
            Добавить ещё
        </Button>
    </>
}