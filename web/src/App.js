import React from 'react';
import './App.css';
import {Provider} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import AppRouter from "./components/app-router/app-router-view";
import Error from "./components/error/view";
import error from "./components/error/slice";
import selectDistricts from "./components/select-districts/slice";
import browseEquities from "./components/browse-equities/slice";

const store = configureStore({
    reducer: {
        error: error,
        browseEquities: browseEquities,
        selectDistricts: selectDistricts
    },
});

function App() {
    return (
        <div className="App">
            <Provider store={store}>
                <AppRouter/>
                <Error/>
            </Provider>
        </div>
    );
}

export default App;
