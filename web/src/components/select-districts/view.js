import React, {useEffect} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {loadDistricts, setFilter, setSelection} from "./slice";
import {Checkbox, Input} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Box from "@material-ui/core/Box";

export default function SelectDistricts(props) {
    const {districts, selected, filter} = useSelector(state => state.selectDistricts, shallowEqual);
    const dispatch = useDispatch();

    useEffect(() => {
        if (districts.length === 0) {
            dispatch(loadDistricts(props.city))
        }
    });

    function handleChange(id, checked) {
        if (checked) {
            if (!selected.includes(id)) {
                dispatch(setSelection([...selected, id]));
            }
        } else if (selected.includes(id)) {
            let index = selected.indexOf(id);
            dispatch(setSelection([...selected.slice(0, index), ...selected.slice(index + 1)]));
        }
    }

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            open={true}
        >
            <DialogContent>
                <Input autoFocus={true} style={{width: "100%"}} onChange={e => dispatch(setFilter(e.target.value))}/>
                {districts.filter(d => filter === '' || d.name.startsWith(filter)).map(d =>
                    <Box key={d.id}>
                        <FormControlLabel
                            control={<Checkbox checked={selected.includes(d.id)}
                                               onChange={(e) => handleChange(d.id, e.target.checked)}/>}
                            label={d.name}
                        />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    props.onCancel()
                }}>
                    Отменить
                </Button>
                <Button onClick={() => {
                    dispatch(setSelection([]))
                }}>
                    Сбросить
                </Button>
                <Button onClick={() => {
                    props.onOk(selected);
                }} color="primary">
                    Применить
                </Button>
            </DialogActions>
        </Dialog>
    );
}