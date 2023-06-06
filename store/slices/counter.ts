import { createSlice } from '@reduxjs/toolkit';

interface CounterStateType {
    value: number;
}

const initialState: CounterStateType = {
    value: 2,
};

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload;
        }
    }
});

export const incrementAsync = (amount: number) => (dispatch: any) => {
    setTimeout(() => {
        dispatch(incrementByAmount(amount));
    }, 1000);
};

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export const selectCount = (state: any) => state.counter.value;

export default counterSlice.reducer;