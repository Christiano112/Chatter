import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SideNav from "@/components/side-nav";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
    const supabase = createServerComponentClient({ cookies });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex">
            <div className="h-full fixed px-0 mx-0">
                <SideNav />
            </div>
            <div className="absolute right-0 min-h-100vh left-0 md:left-[13rem]">{children}</div>
        </div>
    );
};

export default ProtectedLayout;
