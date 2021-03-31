import React, {useEffect, useState} from 'react';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {ruRU} from '@material-ui/core/locale';
import {Provider, useDispatch} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import AppRouter from "./components/app-router/app-router-view";
import error from "./components/show-error/slice";
import success, {showSuccess} from "./components/show-success/slice";
import filter from "./components/set-filter/slice";
import selectDistricts from "./components/select-districts/slice";
import selectSubways from "./components/select-subways/slice";
import browseEquities from "./components/browse-equities/slice";
import addEquity from "./components/add-equity/slice";
import createRequest from "./components/create-request/slice";
import createAgent from "./components/create-agent/slice";
import appBar from "./components/app-bar/slice";
import browseRequests from "./components/browse-my-requests/slice";
import browseAssignedRequests from "./components/browse-assigned-requests/slice";
import createMeeting from "./components/create-meeting/slice";
import rescheduleMeeting from "./components/reschedule-meeting/slice";
import browseMeetings from "./components/browse-my-meetings/slice";
import browseAssignedMeetings from "./components/browse-assigned-meetings/slice";
import editAddress from "./components/edit-address/slice";
import editTimeSlots from "./components/edit-timeslots/slice";
import browseAdmin from "./components/browse-admins/slice";
import browseAgents from "./components/browse-agents/slice";
import createComment from "./components/create-comment/slice";
import Auth from "./components/show-error/auth";
import {makeStyles} from "@material-ui/core";
import {initFirebase, onMessageReceived} from "./api/FirebaseAPI";

const store = configureStore({
    reducer: {
        error: error,
        success: success,
        appBar: appBar,
        browseAdmin: browseAdmin,
        browseAgents: browseAgents,
        browseEquities: browseEquities,
        filter: filter,
        selectDistricts: selectDistricts,
        selectSubways: selectSubways,
        addEquity: addEquity,
        createRequest: createRequest,
        createAgent: createAgent,
        browseRequests: browseRequests,
        browseAssignedRequests: browseAssignedRequests,
        createMeeting: createMeeting,
        rescheduleMeeting: rescheduleMeeting,
        browseMeetings: browseMeetings,
        browseAssignedMeetings: browseAssignedMeetings,
        editAddress: editAddress,
        editTimeSlots: editTimeSlots,
        createComment: createComment
    },
});

const useStyles = makeStyles(theme => ({
    waitAuth: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

export default function App() {
    const theme = createMuiTheme({}, ruRU);
    const [authInitialised, setAuthInitialised] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        if (!authInitialised)
            initFirebase().then(() => setAuthInitialised(true))
    });

    if (authInitialised)
        return (
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <Auth/>
                    <AppRouter/>
                    <ShowMessageInfo/>
                </Provider>
            </ThemeProvider>
        );
    else
        return <div className={classes.waitAuth}>
            <div id="firebaseui-auth-container"/>
            {/*<CircularProgress/>*/}
    </div>
}

function ShowMessageInfo() {
    const dispatch = useDispatch();

    useEffect(() => {
        onMessageReceived(m => {
            dispatch(showSuccess(m.notification.title));
        })
    });
    return <></>
}