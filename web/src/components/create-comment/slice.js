import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice"
import CommentAPI from "../../api/CommentAPI";
import {showSuccess} from "../show-success/slice";

const slice = createSlice({
    name: 'create-comment',
    initialState: {
        open: false,
        rate: 0,
        text: ''
    },
    reducers: {
        showCreateComment: (state, {payload}) => {
            state.open = payload
        },
        setRate: (state, {payload}) => {
            state.rate = payload
        },
        setText: (state, {payload}) => {
            state.text = payload
        },
    }
});

export default slice.reducer
export const {showCreateComment, setRate, setText} = slice.actions;

export const createComment = (request, rate, text) => async dispatch => {
    try {
        const customerId = localStorage.getItem("customerId");
        let dto = {
            createdBy: parseInt(customerId),
            about: request.about.id,
            rate: rate,
            text: text
        };
        await CommentAPI.createComment(dto);
        dispatch(showSuccess("Коментарий добавлен"))
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};
