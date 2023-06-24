"use client";

import supaBase from "@/utils/supabase";
import { useRouter } from "next/navigation";
import Button from "./button";
import { ErrorToast, SuccessToast } from "./toast";

const SignOutBtn = () => {
    const router = useRouter();
    const signOut = async () => {
        const { error } = await supaBase.auth.signOut();
        if (error) {
            ErrorToast(error?.message);
            return;
        }
        SuccessToast("Bye for now, See you soon!");
        router.refresh();
    };

    return (
        <div>
            <Button
                text={`Log out`}
                type="button"
                style={{ border: "1px solid red", color: "red" }}
                handleClick={() => signOut()}
            />
        </div>
    );
};

export default SignOutBtn;
