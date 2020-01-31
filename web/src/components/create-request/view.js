import React from "react";
import {Dialog, DialogContent, ListItem, TextField} from "@material-ui/core";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import FormLabel from "@material-ui/core/FormLabel";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {saveRequest, setContact, setContacts, setContactType, setName, showAgent} from "./slice";

const CONTACT_TYPES = {
    PHONE: {label: 'Телефон', type: 'tel'},
    MAIL: {label: 'Почта', type: 'email'},
    SKYPE: {label: 'Скайп', type: 'text'},
    TELEGRAM: {label: 'Телеграм', type: 'tel'},
    VIBER: {label: 'Вайбер', type: 'tel'},
    WHATSAPP: {label: 'Вацап', type: 'tel'},
    VK: {label: 'ВКонтакте', type: 'text'},
    FACEBOOK: {label: 'Фейсбук', type: 'text'},
};

export default function CreateCustomer(props) {
    const {name, contacts, contactType, contact, agent} = useSelector(state => state.createRequest, shallowEqual);
    const dispatch = useDispatch();
    return <Dialog disableBackdropClick
                   disableEscapeKeyDown
                   maxWidth="xs"
                   open={props.open}>
        <DialogContent>
            <TextField label="Как к Вам обращаться?"
                       required
                       fullWidth
                       autoFocus
                       value={name}
                       onChange={e => dispatch(setName(e.target.value))}
            />
            <FormLabel>Как с Вами связаться?</FormLabel>
            <List>
                {contacts.map(c => <ListItem>{CONTACT_TYPES[c.contactType].label}&nbsp;{c.contact}</ListItem>)}
            </List>
            <RadioGroup name="contactType" value={contactType} onChange={e => dispatch(setContactType(e.target.value))}>
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
                            onChange={e => dispatch(setContact(e.target.value))}
                            inputProps={{inputMode: k[1].type}}
                        />
                    </div>)}
            </RadioGroup>
            <Button color="primary" onClick={() => {
                dispatch(setContacts([...contacts, {contactType: contactType, contact: contact}]));
                dispatch(setContact(''))
            }}>
                Добавить ещё
            </Button>
        </DialogContent>
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