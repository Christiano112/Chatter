"use client";

import { useRouter } from "next/navigation";
import Button from "./button";
import { ErrorToast, SuccessToast } from "./toast";
import { useAppDispatch } from "@/redux/store";
import { logOut } from "@/redux/slices/user";

const SignOutBtn = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const signOut = async () => {
        try {
            const response = await fetch("/api/auth/signout", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to sign out");
            }

            dispatch(logOut());
            SuccessToast("Bye for now, See you soon!");
            router.refresh();
        } catch (error: any) {
            ErrorToast(error?.message);
        }
    };

    return (
        <>
            <Button
                text={`Log out`}
                type="button"
                style={{ border: "1px solid red", color: "red" }}
                handleClick={() => signOut()}
            />
        </>
    );
};

export default SignOutBtn;
