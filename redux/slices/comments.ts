"use client";

import { RootState } from "../store";
import { formatDateTimeShort } from "@/utils/date";
import { PayloadAction, createSlice, createSelector } from "@reduxjs/toolkit";

export interface CommentsType {
    id: number;
    author_id: string;
    comment_id: string;
    content: string | null;
    created_at?: string | null;
}

const initialState: CommentsType[] = [
    {
        id: 0,
        author_id: "",
        comment_id: "",
        content: "",
        created_at: formatDateTimeShort(new Date().toISOString()),
    },
];

export const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        addComment: (state, action: PayloadAction<CommentsType>) => {
            state.push(action.payload);
        },
        deleteComment: (state, action: PayloadAction<CommentsType>) => {
            state.filter((comment) => comment.comment_id !== action.payload.comment_id);
        },
    },
});

export const { addComment, deleteComment } = commentsSlice.actions;

export const selectComments = createSelector(
    (state: RootState) => state.comments,
    (comments) => comments,
);

export default commentsSlice.reducer;
