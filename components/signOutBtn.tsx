"use client";

import supaBase from "@/utils/supabase";
import Button from "./button";
import { ErrorToast, SuccessToast } from "./toast";
import { useAppDispatch } from "@/redux/store";
import { logOut } from "@/redux/slices/user";

const SignOutBtn = () => {
    const dispatch = useAppDispatch();
    const signOut = async () => {
        const { error } = await supaBase.auth.signOut();
        if (error) {
            ErrorToast(error?.message);
            return;
        }
        dispatch(logOut());
        SuccessToast("Bye for now, See you soon!");
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
