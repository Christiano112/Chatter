"use client";

import { useUser } from "@supabase/auth-helpers-react";
import { usePathname } from "next/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export const usePathId = () => {
    const pathname = usePathname();
    const lastPath = pathname.split("/");
    const pathId = lastPath[lastPath.length - 1];
    return pathId;
};

export const useCheckAuth = () => {
    const user = useUser();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if (user && user?.role === "authenticated" && user?.id) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
    }, [user]);

    return { user, authenticated };
};

export const useCheckAuthRedirect = () => {
    const user = useUser();
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectedFromUrl = searchParams.get("redirectedFrom");

    useEffect(() => {
        if (user && user?.role === "authenticated" && user?.id) {
            setAuthenticated(true);
            router.push(redirectedFromUrl || "/feeds");
        } else {
            setAuthenticated(false);
        }
    }, [user, router, redirectedFromUrl]);

    return { user, authenticated, redirectedFromUrl };
};
