import React, {useEffect} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {districtChecked, districtUnchecked, loadDistricts, setFilter} from "./slice";
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
            dispatch(districtChecked(id))
        } else {
            dispatch(districtUnchecked(id))
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
                <Input autoFocus={true} onChange={(e) => dispatch(setFilter(e.target.value))}/>
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
                }} color="primary">
                    Отменить
                </Button>
                <Button onClick={() => {
                    props.onOk(selected);
                }} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}