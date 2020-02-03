import React, {useEffect, useLayoutEffect} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import Box from "@material-ui/core/Box";
import {createMuiTheme} from "@material-ui/core";
import {setAppTitle} from "../app-bar/slice";
import LoadRecordsProgress from "../common/load-records-progress";


export default function Browse(props) {
    const {slice, loader, title, children, ...other} = props;
    const {records, loading, loadFinished} = useSelector(state => state[slice], shallowEqual);
    const dispatch = useDispatch();
    const theme = createMuiTheme({});

    useEffect(() => {
        if (!loading && !loadFinished)
            dispatch(loader())
    }, [loading, loadFinished]);

    useLayoutEffect(() => {
        dispatch(setAppTitle(title))
    });

    return <Box {...other} style={{marginTop: theme.spacing(1) + theme.mixins.toolbar.minHeight}}>
        <LoadRecordsProgress loading={loading} empty={records.length === 0}/>
        {records.length !== 0 && children}
    </Box>
}