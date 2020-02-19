import {createSlice} from "@reduxjs/toolkit";
import {showError} from "../show-error/slice"
import CommentAPI from "../../api/CommentAPI";
import {showSuccess} from "../show-success/slice";
import {updateRequests} from "../browse-my-requests/slice";

const slice = createSlice({
    name: 'create-comment',
    initialState: {
        open: false,
        rate: 0,
        text: '',
        shared: false
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
       setShared: (state, {payload}) => {
            state.shared = payload
        },
    }
});

export default slice.reducer
export const {showCreateComment, setRate, setText, setShared} = slice.actions;

export const createComment = (request, rate, text, shared) => async dispatch => {
    try {
        const customerId = localStorage.getItem("customerId");
        let dto = {
            createdBy: parseInt(customerId),
            about: request.about.id,
            rate: rate,
            text: text,
            shared: shared
        };
        await CommentAPI.createComment(dto);
        dispatch(showSuccess("Комментарий добавлен"));
        dispatch(updateRequests())
    } catch (reason) {
        dispatch(showError(reason.message))
    }
};
