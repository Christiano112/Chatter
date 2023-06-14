import {
    PayloadAction,
    createSlice,
    nanoid,
    createAsyncThunk,
    createSelector,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import useFetch from "@/hooks/useFetch";

// interface UserStateType {
//     [key: string]: string;
// }

// const initialState: UserStateType = {
//     email: '',
//     image: '',
//     name: '',
// };

const initialState = {
    user: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
        },
    },
});

export const { login } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
