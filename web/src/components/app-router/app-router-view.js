import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import BrowseEquities from "../browse-equities/view";

export default function AppRouter(props) {
    return (
        <Router>
            <Switch>
                <Route path="/" exact {...props}>
                    <Redirect to={{pathname: "/equities"}}/>
                </Route>
                <Route path="/equities" {...props}>
                    <BrowseEquities/>
                </Route>
            </Switch>
        </Router>
    )
}
