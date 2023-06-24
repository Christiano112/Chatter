"use client";

import { PayloadAction, createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import useFetch from "@/hooks/useFetch";

interface UserType {
    first_name: string | null;
    last_name: string | null;
    username: string;
    email: string;
    join_as: string | null;
    user_id: string;
}

const initialState: UserType = {
    email: "",
    first_name: null,
    join_as: null,
    last_name: null,
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
        login: (state, action: PayloadAction<Pick<UserType, "email" | "user_id">>) => {
            const { email, user_id } = action.payload;
            state.user = { ...state.user, email, user_id };
        },
        logout: (state) => {
            state.user = initialState;
        },
        updateUser: (state, action) => {
            state.user = action.payload;
        },
    },
});

export const { signUp, login, logout, updateUser } = userSlice.actions;

export const selectUser = createSelector(
    (state: RootState) => state.user.user,
    (user) => user,
);

export const selectUserEmail = createSelector(
    (state: RootState) => state.user.user?.email,
    (email) => email,
);

export default userSlice.reducer;
