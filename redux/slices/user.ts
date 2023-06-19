import { PayloadAction, createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import useFetch from "@/hooks/useFetch";

export interface UserStateType {
    [key: string]: string;
}

export interface DatabaseUserType {
    [key: string]: string;
}

const initialUserState: UserStateType = {
    email: "",
    image: "",
    name: "",
};

const initialDatabaseUserState: DatabaseUserType = {
    firstName: "",
    lastName: "",
    username: "",
    joinAs: "",
    email: "",
};

interface UserState {
    user: UserStateType;
    databaseUser: DatabaseUserType;
}

const initialState: UserState = {
    user: initialUserState,
    databaseUser: initialDatabaseUserState,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = initialState.user;
        },
        updateUser: (state, action) => {
            state.user = action.payload;
        },
        updateDatabaseUser: (state, action) => {
            state.databaseUser = action.payload;
        },
    },
});

export const { login, logout, updateUser, updateDatabaseUser } = userSlice.actions;

export const selectUser = createSelector(
    (state: RootState) => state.user.user,
    (user) => user,
);

export const selectDatabaseUser = createSelector(
    (state: RootState) => state.user.databaseUser,
    (databaseUser) => databaseUser,
);

export const selectUserEmail = createSelector(
    (state: RootState) => state.user.user?.email,
    (email) => email,
);

export default userSlice.reducer;
