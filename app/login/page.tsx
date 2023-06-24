"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { AiFillGoogleCircle, AiFillGithub } from "react-icons/ai";
import { SuccessToast, ErrorToast } from "@/components/toast";
import Input from "@/components/input";
import Button from "@/components/button";
import { useAppDispatch } from "@/redux/store";
import { login } from "@/redux/slices/user";
import supaBase from "@/utils/supabase";
import { useLoginForm, LoginType } from "@/utils/form";
import { getURL } from "@/utils/urls";

const Login = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const onLogin = async (data: LoginType) => {
        const { email, password } = data;
        try {
            const { data, error } = await supaBase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            console.log("data", data, "error", error);
            if (error) {
                ErrorToast(error?.message);
                return;
            }

            // const { data: userData, error: emailError } = await supaBase
            //     .from("users")
            //     .select("email")
            //     .eq("email", email)
            //     .limit(1);

            // if (emailError || userData.length === 0) {
            //     ErrorToast(emailError?.message || "Email does not exist");
            //     // return;
            // }

            SuccessToast("Login Successful");
            router.refresh();
            setTimeout(() => {
                router.push("/protected");
            }, 2000);
            // dispatch(login(data));
        } catch (error) {
            ErrorToast("An error occurred during login");
        }
    };

    const { register, handleFormSubmit, errors } = useLoginForm(onLogin);

    async function signInWithGoogle() {
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
    }

    async function signInWithGitHub() {
        const { data, error } = await supaBase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: getURL(),
            },
        });
    }

    return (
        <div className="flex h-[100vh] min-h-full">
            <div
                className="hidden md:flex flex-col items-center justify-center px-4"
                style={{ background: "url('/side.jpg') center no-repeat", backgroundSize: "cover" }}
            >
                <h1 className="text-4xl text-black text-center my-8 font-semibold">Chatter</h1>
                <p className="text-black font-bold">
                    Unleash the Power of Words, Connect with Like-minded Readers and Writers
                </p>
            </div>
            <section className="w-full mt-10 flex flex-col items-center">
                <h1 className="text-2xl md:text-4xl text-black text-center mt-8 md:mt-[4rem] font-bold">
                    Welcome Back
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
                <p className="">
                    Don{"'"}t have an account?{" "}
                    <Link href="/signup" className="underline">
                        Sign Up
                    </Link>
                </p>
                <div className="flex flex-col items-center justify-center">
                    <p>Sign in with Socials</p>
                    <button
                        className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg mt-2"
                        onClick={signInWithGoogle}
                    >
                        <AiFillGoogleCircle className="mr-2 text-xl" />
                        Google
                    </button>
                    <button
                        className="flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-lg mt-2"
                        onClick={signInWithGitHub}
                    >
                        <AiFillGithub className="mr-2 text-xl" />
                        GitHub
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Login;
