import React from 'react';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {ruRU} from '@material-ui/core/locale';
import {Provider} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import AppRouter from "./components/app-router/app-router-view";
import error from "./components/show-error/slice";
import success from "./components/show-success/slice";
import filter from "./components/set-filter/slice";
import selectDistricts from "./components/select-districts/slice";
import selectSubways from "./components/select-subways/slice";
import browseEquities from "./components/browse-equities/slice";
import addEquity from "./components/add-equity/slice";
import createRequest from "./components/create-request/slice";
import createAgent from "./components/create-agent/slice";
import appBar from "./components/app-bar/slice";
import browseRequests from "./components/browse-my-requests/slice";

const store = configureStore({
    reducer: {
        error: error,
        success: success,
        appBar:appBar,
        browseEquities: browseEquities,
        filter: filter,
        selectDistricts: selectDistricts,
        selectSubways: selectSubways,
        addEquity: addEquity,
        createRequest: createRequest,
        createAgent: createAgent,
        browseRequests: browseRequests
    },
});

export default function App() {
    const theme = createMuiTheme({}, ruRU);
    return (
        <div>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <AppRouter/>
                </Provider>
            </ThemeProvider>
        </div>
    );
}

