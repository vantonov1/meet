import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import React from "react";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        width: '100%',
        position: 'absolute'
     },
    progress: {position: "absolute", width: '100%', textAlign: 'center', marginTop: theme.spacing(1)},
    noItems: {width: '100%', textAlign: 'center', marginTop: theme.spacing(1)},
}));

export default function LoadRecordsProgress(props) {
    const classes = useStyles();

    return <Box className={classes.root}>
        {props.loading && <span className={classes.progress}><CircularProgress/></span>}
        {!props.loading && props.empty && <span className={classes.noItems}>Нет записей</span>}
    </Box>
}