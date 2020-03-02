import React, {useState} from "react";
import EnterValue from "./enter-value";
import {Input, TextField} from "@material-ui/core";
import ShowInfo from "./showInfo";
import Typography from "@material-ui/core/Typography";

export function Invite(props) {
    const {open, page, onEmail, onOk, onCancel, invitation} = props;
    const [email, setEmail] = useState('');
    return <>
        <EnterValue open={open} onCancel={onCancel} onOk={() => {
            onEmail(email);
        }}>
            <TextField label="Электронная почта"
                       autoFocus
                       value={email}
                       onChange={e => setEmail(e.target.value)}
                       type="email"
                       inputProps={{inputMode: 'email'}}/>
        </EnterValue>
        {invitation && <ShowInfo open={true} onOk={onOk}>
            <Typography variant="h6">
                Приглашение отправлено по почте.
                Если письмо не дошло, отправьте ссылку для регистрации любым способом:
            </Typography>
            <Input multiline value={window.location.origin + '/#/registration/' + page + '?invitation=' + invitation} fullWidth/>
        </ShowInfo>}
    </>
}