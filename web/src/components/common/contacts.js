import React from "react";
import {CONTACT_TYPES} from "./constants";

export function Contacts(props) {
    const {person} = props;
    return person.contacts? person.contacts.map(c => <span key={c.contactType + c.contact}>
                &nbsp;{CONTACT_TYPES[c.contactType].label}&nbsp;<GetHref c={c}/>
            </span>)
        : <span/>;
}

const withoutPlus = n => n.startsWith('+') ? n.slice(1) : n;

function GetHref(props) {
    const  {c} = props;

    switch (c.contactType) {
        case "MAIL": return <a href={'mailto:' + c.contact}>{c.contact}</a>;
        case "TELEGRAM": if(c.contact.match('^[/d\+]')) return <span>{c.contact}</span>;
                            else return <a href={'https://t.me/' + c.contact}>{c.contact}</a>;
        case 'SKYPE': return <a href={'skype:' + c.contact + '?chat'}>{c.contact}</a>;
        case 'VIBER': return <a href={'viber://chat?number=' + withoutPlus(c.contact)}>{c.contact}</a>;
        case 'WHATSAPP': return <a href={'https://wa.me/' + withoutPlus(c.contact)}>{c.contact}</a>;
        case 'FACEBOOK': return <a href={' http://m.me/' + c.contact}>{c.contact}</a>;
        case 'VK': return <a href={'vkontakte://profile/' + c.contact}>{c.contact}</a>;
        default: return <span>{c.contact}</span>
    }
}

