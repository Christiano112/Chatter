"use client";

import React from "react";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import store from "@/redux/store";

export interface SessionProviderProps {
    children: React.ReactNode;
    session?: any;
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
        <SessionProvider session={session}>
            <Provider store={store}>{children}</Provider>
            <ToastContainer />
        </SessionProvider>
    );
};

export default CustomLayout;
