"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiFillGoogleCircle, AiFillGithub } from "react-icons/ai";
import { SuccessToast, ErrorToast } from "@/components/toast";
import Input from "@/components/input";
import Button from "@/components/button";
import { useAppDispatch } from "@/redux/store";
import { login, fetchUserFromDB } from "@/redux/slices/user";
import supaBase from "@/utils/supabase";
import { useLoginForm, LoginType } from "@/utils/form";
import { getURL } from "@/utils/urls";
import { useCheckAuthRedirect } from "@/utils/custom";

const mapLoginDataFromColumns = (userData: any) => {
    const { first_name, last_name, username, join_as, email, user_id } = userData;

    return {
        first_name,
        last_name,
        username,
        join_as,
        email,
        user_id,
    };
};

const Login = () => {
    // If this is true, means user is signed in and it redirects automatically
    const { authenticated, redirectedFromUrl } = useCheckAuthRedirect();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const onLogin = async (data: LoginType) => {
        const { email, password } = data;
        try {
            const { data, error } = await supaBase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                ErrorToast(error?.message);
                return;
            }

            const { data: userData, error: emailError } = await supaBase
                .from("users")
                .select("*")
                .eq("email", email)
                .limit(1);

            if (emailError || userData.length === 0) {
                ErrorToast(emailError?.message || "Email does not exist");
                return;
            }

            const mappedData = mapLoginDataFromColumns(userData[0]);

            // dispatch(fetchUserFromDB(email));
            dispatch(login(mappedData));
            SuccessToast("Login Successful");
            router.push(redirectedFromUrl || "/feeds");
        } catch (error) {
            ErrorToast("An error occurred during login");
        }
    };

    const { register, handleFormSubmit, errors } = useLoginForm(onLogin);

    const signInWithGoogle = async () => {
        const { data, error } = await supaBase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: getURL(),
            },
        });
        if (error) {
            ErrorToast(error?.message);
            return;
        }
    };

    const signInWithGitHub = async () => {
        const { data, error } = await supaBase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: getURL(),
            },
        });
        if (error) {
            ErrorToast(error?.message);
            return;
        }
    };

    return (
        <React.Suspense fallback={null}>
            <div className="flex h-[100vh] min-h-full">
                <div
                    className="hidden md:flex flex-col items-center justify-center px-4"
                    style={{
                        background: "url('/side.jpg') center no-repeat",
                        backgroundSize: "cover",
                    }}
                >
                    <h1 className="text-4xl text-black text-center my-8 font-semibold">Chatter</h1>
                    <p className="text-black font-bold">
                        Unleash the Power of Words, Connect with Like-minded Readers and Writers
                    </p>
                </div>
                <section className="w-full my-10 flex flex-col items-center">
                    <h1 className="text-2xl md:text-4xl text-black text-center font-bold">
                        Welcome Back to <span className="text-primary">Chatter</span>
                    </h1>
                    <form
                        method="post"
                        action=""
                        onSubmit={handleFormSubmit}
                        className="mx-auto mt-8 md:mt-[4rem] w-[90%] md:w-[80%] pb-8"
                    >
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
                            autoComplete="current-password"
                            register={register}
                            errors={errors}
                        />
                        <Button
                            text="Login"
                            type="submit"
                            variant="primary"
                            handleClick={handleFormSubmit}
                        />
                    </form>
                    <div className="flex flex-col items-center justify-center p-4 rounded shadow-inner w-[80%] mx-auto">
                        <h5 className="font-medium text-xl">Or Sign in with Socials</h5>
                        <button
                            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg mt-2"
                            onClick={signInWithGoogle}
                        >
                            <AiFillGoogleCircle className="mr-2 text-4xl" />
                            Google
                        </button>
                        <button
                            className="flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-lg mt-2"
                            onClick={signInWithGitHub}
                        >
                            <AiFillGithub className="mr-2 text-4xl" />
                            GitHub
                        </button>
                    </div>
                    <p className="mt-10">
                        Don{"'"}t have an account?{" "}
                        <Link
                            href="/signup"
                            className="underline hover:text-blue-800 hover:underline-offset-8"
                        >
                            Sign Up
                        </Link>
                    </p>
                </section>
            </div>
        </React.Suspense>
    );
};

export default Login;
