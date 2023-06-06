import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import counterReducer from "./slices/counter";
import userReducer from "./slices/user";

const store = configureStore({
    reducer: {
        counter: counterReducer,
        user: userReducer,
        // posts: postsReducer,
        // comments: commentsReducer,
        // notifications: notificationsReducer,
        // messages: messagesReducer,
        // search: searchReducer,
        // tags: tagsReducer,
        // likes: likesReducer,
        // follows: followsReducer,
        // settings: settingsReducer,
        // theme: themeReducer,
        // auth: authReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;