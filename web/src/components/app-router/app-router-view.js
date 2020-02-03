import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import Error from "../show-error/view";
import Success from "../show-success/view";
import MainAppBar from "../app-bar/view";
import BrowseEquities from "../browse-equities/view";
import BrowseMyRequests from "../browse-my-requests/view";
import BrowseAssignedRequests from "../browse-assigned-requests/view";
import BrowseMyMeetings from "../browse-my-meetings/view";
import BrowseAssignedMeetings from "../browse-assigned-meetings/view";

export default function AppRouter(props) {
    return (
        <Router>
            <MainAppBar/>
            <Error/>
            <Success/>
            <Switch>
                <Route path="/" exact {...props}>
                    <Redirect to={{pathname: "/equities"}}/>
                </Route>
                <Route path="/equities" {...props}>
                    <BrowseEquities/>
                </Route>
                <Route path="/my-requests" {...props}>
                    <BrowseMyRequests/>
                </Route>
                <Route path="/assigned-requests" {...props}>
                    <BrowseAssignedRequests/>
                </Route>
                <Route path="/my-meetings" {...props}>
                    <BrowseMyMeetings/>
                </Route>
               <Route path="/assigned-meetings" {...props}>
                    <BrowseAssignedMeetings/>
                </Route>
            </Switch>
        </Router>
    )
}
