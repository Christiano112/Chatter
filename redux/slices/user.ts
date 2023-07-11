"use client";

import { RootState } from "../store";
import { PayloadAction, createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import supaBase from "@/utils/supabase";

export interface UserType {
    first_name: string | null;
    last_name: string | null;
    username: string;
    email: string;
    join_as: string | null;
    user_id?: string;
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

// fetch user info from database
export const fetchUserFromDB = createAsyncThunk("user/fetchUser", async (email: string) => {
    const { data, error } = await supaBase.from("users").select("*").eq("email", email);
    if (error) {
        throw error;
    }
    return data as UserType[];
});

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
            state.user = { ...state.user, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserFromDB.fulfilled, (state, action) => {
            state.user = action.payload[0];
        });
    },
});

export const { signUp, login, logOut, updateUser } = userSlice.actions;

export const selectUser = createSelector(
    (state: RootState) => state.user.user,
    (user) => user,
);

export default userSlice.reducer;
