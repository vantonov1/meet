import React, {useEffect, useLayoutEffect} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import Box from "@material-ui/core/Box";
import {createMuiTheme} from "@material-ui/core";
import {setAppTitle} from "../app-bar/slice";
import LoadRecordsProgress from "../common/load-records-progress";


export default function Browse(props) {
    const {slice, loader, title, children, topLevel, ...other} = props;
    const {records, loading, loadFinished} = useSelector(state => state[slice], shallowEqual);
    const dispatch = useDispatch();
    const theme = createMuiTheme({});

    useEffect(() => {
        if (!loading && !loadFinished)
            dispatch(loader())
    });

    useLayoutEffect(() => {
        dispatch(setAppTitle(title))
    }, [title]);

    const style = topLevel
        ? {display: 'flex', marginTop: theme.spacing(1) + theme.mixins.toolbar.minHeight}
        : {display: 'flex'};
    return <Box {...other} style={style}>
        <LoadRecordsProgress loading={loading} empty={records.length === 0}/>
        {records.length !== 0 && children}
    </Box>
}