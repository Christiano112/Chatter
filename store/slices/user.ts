import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import useFetch from '@/hooks/useFetch';

// interface UserStateType {
//     [key: string]: string;
// }

// const initialState: UserStateType = {
//     email: '',
//     image: '',
//     name: '',
// };

const initialState = {
    user: null
}

// const fetchUser = (userId: string) => {

//     return (dispatch: any, getState: RootState) => {
//         try {
//             const { data } = useFetch(`/users/${userId}`);
//             dispatch(login(data));
//         } catch (err) {
//             console.log(err);
//         }
//     };
// };

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
        }
    }
});

export const { login } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;