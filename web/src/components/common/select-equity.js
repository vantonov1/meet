import Browse from "./abstract-browser";
import {EQUITY_TYPES} from "./constants";
import React, {useEffect, useState} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import EditAddress from "../edit-address/view";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Dialog, DialogActions, DialogContent, List} from "@material-ui/core";
import {findEquitiesByAddress, updateEquities} from "../browse-equities/slice";
import {Equity} from "./equities-list";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        width: 400,
        height: "100%",
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    items: {
        width: "inherit"
    }
}));

export default function SelectEquity(props) {
    const {records} = useSelector(state => state.browseEquities, shallowEqual);
    const {open, city, type, onSelect, onCancel} = props;
    const [address, setAddress] = useState({city: city});
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateEquities())
    }, [open]);

    return <Dialog open={open}>
        <DialogContent>
            <EditAddress initialAddress={address}
                         selectDistrict={false}
                         selectSubway={false}
                         validation={{}}
                         onChange={(address) => {
                             dispatch(updateEquities());
                             setAddress(address);
                         }}
            />
            <Browse slice="browseEquities" title={EQUITY_TYPES[type]}
                    loader={() => findEquitiesByAddress(type, address)}
                    className={classes.root}>
                <List className={classes.items}>
                    {records.map((equity) => (
                        <Equity key={equity.id} selected={false}
                                {...equity}
                                onClick={(e) => onSelect(equity)}
                        />
                    ))}
                </List>
            </Browse>
            <DialogActions>
                <Button onClick={() => onCancel()}>
                    Отменить
                </Button>
            </DialogActions>
        </DialogContent>
    </Dialog>
}