"use client";

import React from "react";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/redux/store";
import { Analytics } from "@vercel/analytics/react";

export interface CustomLayoutPropType {
    children: React.ReactNode;
}

const CustomLayout = ({ children }: CustomLayoutPropType) => {
    React.useEffect(() => {
        ToastContainer;
    }, []);

    return (
        <React.StrictMode>
            <Provider store={store}>
                <PersistGate persistor={persistor} loading={null}>
                    {children}
                    <ToastContainer />
                    <Analytics />
                </PersistGate>
            </Provider>
        </React.StrictMode>
    );
};

export default CustomLayout;
