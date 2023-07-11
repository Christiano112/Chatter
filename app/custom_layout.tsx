"use client";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { Analytics } from "@vercel/analytics/react";
import React from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/redux/store";

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
