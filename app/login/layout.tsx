import React from "react";
import Loading from "@/app/loading";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return <React.Suspense fallback={<Loading />}>{children}</React.Suspense>;
};

export default Layout;
