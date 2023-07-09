"use client";

import React from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/redux/store";
import { Analytics } from "@vercel/analytics/react";

export interface CustomLayoutPropType {
    children: React.ReactNode;
    initialSession: Session;
}

const CustomLayout = ({ children, initialSession }: CustomLayoutPropType) => {
    React.useEffect(() => {
        // eslint-disable-next-line no-unused-expressions
        ToastContainer;
    }, []);

    const [supabaseClient] = React.useState(() => createPagesBrowserClient());

    return (
        <React.StrictMode>
            <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
                <Provider store={store}>
                    <PersistGate persistor={persistor} loading={null}>
                        {children}
                        <ToastContainer />
                        <Analytics />
                    </PersistGate>
                </Provider>
            </SessionContextProvider>
        </React.StrictMode>
    );
};

export default CustomLayout;
