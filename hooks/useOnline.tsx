"use client";

import { useState, useEffect } from "react";
import { InfoToast } from "@/components/toast";

const useOnline = () => {
    const [online, setOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handler = () => setOnline(navigator.onLine);
        window.addEventListener("online", handler);
        window.addEventListener("offline", handler);
        return () => {
            window.removeEventListener("online", handler);
            window.removeEventListener("offline", handler);
        };
    }, []);

    console.log("online", online);

    if (!online) {
        InfoToast("You are offline, kindly connect to the internet");
    }

    return online;
};

export default useOnline;
