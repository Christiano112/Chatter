"use client";

import { PayloadAction, createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface UserType {
    first_name: string | null;
    last_name: string | null;
    username: string;
    email: string;
    join_as: string | null;
    user_id: string;
    created_at?: string | null;
    id?: number;
}

const initialState: UserType = {
    email: "",
    first_name: null,
    last_name: null,
    join_as: null,
    user_id: "",
    username: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState: { user: initialState },
    reducers: {
        signUp: (state, action: PayloadAction<UserType>) => {
            state.user = action.payload;
        },
        login: (state, action: PayloadAction<UserType>) => {
            state.user = action.payload;
        },
        logOut: (state) => {
            state.user = initialState;
        },
        updateUser: (state, action) => {
            state.user = action.payload;
        },
    },
});

export const { signUp, login, logOut, updateUser } = userSlice.actions;

export const selectUser = createSelector(
    (state: RootState) => state.user.user,
    (user) => user,
);

export const selectUserEmail = createSelector(
    (state: RootState) => state.user.user?.email,
    (email) => email,
);

export default userSlice.reducer;
