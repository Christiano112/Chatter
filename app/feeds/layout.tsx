import React from "react";
import SideNav from "@/components/side-nav";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex gap-8">
            <SideNav />
            {children}
        </div>
    );
};

export default Layout;
