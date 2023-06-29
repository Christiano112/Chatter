"use client";

import { usePathname } from "next/navigation";

export const usePathId = () => {
    const pathname = usePathname();
    const lastPath = pathname.split("/");
    const pathId = lastPath[lastPath.length - 1];
    return pathId;
};
