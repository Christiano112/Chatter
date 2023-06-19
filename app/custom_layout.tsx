"use client";

import React from "react";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/redux/store";
import { Session } from "next-auth";

export interface SessionProviderProps {
    children: React.ReactNode;
    session?: Session | null;
    baseUrl?: string;
    basePath?: string;
    refetchInterval?: number;
    refetchOnWindowFocus?: boolean;
    refetchWhenOffline?: false;
}

const CustomLayout = ({ children, session }: SessionProviderProps) => {
    React.useEffect(() => {
        ToastContainer;
    }, []);

    return (
        <React.StrictMode>
            <SessionProvider session={session}>
                <Provider store={store}>
                    <PersistGate persistor={persistor} loading={null}>
                        {children}
                    </PersistGate>
                </Provider>
                <ToastContainer />
            </SessionProvider>
        </React.StrictMode>
    );
};

export default CustomLayout;
