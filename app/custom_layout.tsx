"use client";

import React from "react";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "@/redux/store";
import type { Persistor } from "redux-persist/es/types";
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
    // Create a persistor only on the client side
    let persistor: any = null;

    if (typeof window !== "undefined") {
        persistor = persistStore(store) as Persistor;
    }

    React.useEffect(() => {
        ToastContainer;

        // Pause and unpause persistor based on the component lifecycle
        persistor && persistor.pause();
        return () => {
            persistor && persistor.flush();
            persistor && persistor.persist();
        };
    }, []);

    return (
        <SessionProvider session={session}>
            <Provider store={store}>
                <PersistGate persistor={persistor} loading={null}>
                    {children}
                </PersistGate>
            </Provider>
            <ToastContainer />
        </SessionProvider>
    );
};

export default CustomLayout;
