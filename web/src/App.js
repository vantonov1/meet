import React from 'react';
import './App.css';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {ruRU} from '@material-ui/core/locale';
import {Provider} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import AppRouter from "./components/app-router/app-router-view";
import MainAppBar from "./components/app-bar/view";
import Error from "./components/show-error/view";
import error from "./components/show-error/slice";
import filter from "./components/set-filter/slice";
import selectDistricts from "./components/select-districts/slice";
import selectSubways from "./components/select-subways/slice";
import browseEquities from "./components/browse-equities/slice";
import addEquity from "./components/add-equity/slice";
import createRequest from "./components/create-request/slice";

const store = configureStore({
    reducer: {
        error: error,
        browseEquities: browseEquities,
        filter: filter,
        selectDistricts: selectDistricts,
        selectSubways: selectSubways,
        addEquity: addEquity,
        createRequest: createRequest
    },
});

function App() {
    const theme = createMuiTheme({}, ruRU);
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <MainAppBar/>
                    <AppRouter/>
                    <Error/>
                </Provider>
            </ThemeProvider>
        </div>
    );
}

export default App;
