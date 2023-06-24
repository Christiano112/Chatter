"use client";

// import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store";
import { signUp } from "@/redux/slices/user";
import { SuccessToast, ErrorToast } from "@/components/toast";
import Input from "@/components/input";
import Button from "@/components/button";
import Select from "@/components/select";
import supaBase from "@/utils/supabase";
import { useSignUpForm, SignUpType } from "@/utils/form";
import Link from "next/link";

const mapSignUpDataToColumns = (signUpData: SignUpType, id: string) => {
    const { first_name, last_name, username, join_as, email } = signUpData;

    return {
        first_name,
        last_name,
        username,
        join_as,
        email,
        user_id: id,
    };
};

const SignUp = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const onSignUp = async (data: SignUpType) => {
        const { email, password } = data;
        const { data: newData, error: newEror } = await supaBase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}api/auth/callback/route`,
            },
        });
        if (newData?.user?.id) {
            const mappedData = mapSignUpDataToColumns(data, newData.user.id);
            const { error } = await supaBase.from("users").insert([mappedData]);

            if (error) {
                if (error?.message.includes("duplicate") && error?.message.includes("username")) {
                    ErrorToast("Username already exists");
                    return;
                }
                if (error?.message.includes("duplicate") && error?.message.includes("email")) {
                    ErrorToast("Email already exists");
                    return;
                }
                ErrorToast(error?.message);
                return;
            }

            console.log("data=====", newData, "error=========", newEror);
            dispatch(signUp(mappedData));
            SuccessToast("Sign Up Successful");
            router.refresh();
            // router.push("/feeds");
        }
    };

    const { register, handleFormSubmit, errors } = useSignUpForm(onSignUp);

    return (
        <div className="flex">
            <div
                className="hidden md:flex flex-col items-center justify-center px-4"
                style={{ background: "url('/side.jpg') center no-repeat", backgroundSize: "cover" }}
            >
                <h1 className="text-4xl text-black text-center my-8 font-semibold">Chatter</h1>
                <p className="text-black font-bold">
                    Unleash the Power of Words, Connect with Like-minded Readers and Writers
                </p>
            </div>
            <section className="w-full my-10 flex flex-col items-center">
                <h1 className="text-2xl md:text-4xl text-black text-center font-bold">
                    Register as a Writer/Reader
                </h1>
                <form onSubmit={handleFormSubmit} className="mx-auto mt-8 w-[90%] md:w-[80%] pb-8">
                    <div className="flex flex-col lg:flex-row gap-0 lg:gap-4 lg:items-center lg:justify-between">
                        <Input
                            label="First Name"
                            name="first_name"
                            placeholder="Enter your first name"
                            type="text"
                            autoComplete="name"
                            register={register}
                            errors={errors}
                        />
                        <Input
                            label="Last Name"
                            name="last_name"
                            placeholder="Enter your last name"
                            type="text"
                            autoComplete="name"
                            register={register}
                            errors={errors}
                        />
                    </div>
                    <Input
                        label="Username"
                        name="username"
                        placeholder="Enter your username"
                        type="text"
                        // autoComplete="username"
                        register={register}
                        errors={errors}
                    />
                    <Select
                        label="You are joining as"
                        name="join_as"
                        register={register}
                        options={["writer", "reader"]}
                        errors={errors}
                    />
                    <Input
                        label="Email"
                        name="email"
                        placeholder="Email"
                        type="email"
                        autoComplete="email"
                        register={register}
                        errors={errors}
                    />
                    <Input
                        label="Password"
                        name="password"
                        placeholder="Password"
                        type="password"
                        autoComplete="new-password"
                        register={register}
                        errors={errors}
                    />
                    <Input
                        label="Confirm Password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        type="password"
                        autoComplete="new-password"
                        register={register}
                        errors={errors}
                    />
                    <Button
                        text="Create account"
                        type="submit"
                        variant="primary"
                        handleClick={handleFormSubmit}
                    />
                </form>
                <p className="">
                    Already have an account?{" "}
                    <Link href="/login" className="underline">
                        Login
                    </Link>
                </p>
            </section>
        </div>
    );
};

export default SignUp;
