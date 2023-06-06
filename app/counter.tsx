"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { increment, decrement, incrementByAmount } from "@/store/slices/counter";

const Counter = () => {
    const count = useAppSelector((state) => state.counter.value);
    const dispatch = useAppDispatch();

    return (
        <div>
            <h1>Counter</h1>
            <div>
                <button aria-label="Increment value" onClick={() => dispatch(increment())}>
                    Increment
                </button>
                <span>{count}</span>
                <button aria-label="Decrement value" onClick={() => dispatch(decrement())}>
                    Decrement
                </button>
                <button
                    aria-label="Increment value by 10"
                    onClick={() => dispatch(incrementByAmount(10))}
                >
                    Increment by 10
                </button>
            </div>
        </div>
    );
};

export default Counter;
