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
import RegisterAdmin from "../register-admin/view";
import BrowseAdmin from "../browse-admin/view";
import RegisterAgent from "../create-agent/view";

export default function AppRouter(props) {
    return (
        <Router>
            <MainAppBar/>
            <Error/>
            <Success/>
            <Switch>
                <Route path="/" exact>
                    <Redirect to={{pathname: "/equities"}}/>
                </Route>
                <Route path="/equities">
                    <BrowseEquities/>
                </Route>
                <Route path="/my-requests">
                    <BrowseMyRequests/>
                </Route>
                <Route path="/assigned-requests">
                    <BrowseAssignedRequests/>
                </Route>
                <Route path="/my-meetings">
                    <BrowseMyMeetings/>
                </Route>
                <Route path="/assigned-meetings">
                    <BrowseAssignedMeetings/>
                </Route>
                <Route path="/admin" exact>
                    <Redirect to={{pathname: "/admin/agents"}}/>
                </Route>
                <Route path="/admin/agents" exact>
                    <BrowseAdmin tab="0"/>
                </Route>
                <Route path="/admin/administrators" exact>
                    <BrowseAdmin tab="1"/>
                </Route>
                <Route path="/admin/administrators/registration">
                    <RegisterAdmin/>
                </Route>
                <Route path="/admin/agents/registration">
                    <RegisterAgent/>
                </Route>
            </Switch>
        </Router>
    )
}
