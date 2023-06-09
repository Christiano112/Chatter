"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { SuccessToast, ErrorToast } from "@/components/toast";
import Input from "@/components/input";
import Button from "@/components/button";
import { useSession, signIn, signOut, getProviders, getCsrfToken } from "next-auth/react";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { login } from "@/redux/slices/user";

const loginSchema = object({
    email: string().trim().email("Must be a valid email").required("Email is required"),
    password: string()
        .trim()
        .min(8, "Password must be a minimum of 8 characters")
        .required("Password is required"),
}).required();

const Login = ({
    providers,
    csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { data: session } = useSession();
    console.log("session", session);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });
    const router = useRouter();
    const [signedIn, setSignedIn] = React.useState(true);

    const onLogin = (data: any) => {
        console.log(data);
        SuccessToast("Login Successful");
        // Redirect to homepage
        // router.push("/");

        dispatch(login(data));
    };

    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.user);

    console.log("currentUser", currentUser);

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
                <div className="w-full flex justify-evenly bg-white shadow-lg rounded-t-lg">
                    <button
                        className={
                            !signedIn
                                ? "text-lg md:text-2xl bg-primary w-full py-4 text-white"
                                : "text-lg md:text-2xl w-full py-4 bg-white text-primary rounded-tl-lg"
                        }
                        onClick={() => {
                            setSignedIn(true);
                            router.push("/signup");
                        }}
                    >
                        Register
                    </button>
                    <button
                        className={
                            signedIn
                                ? "text-lg md:text-2xl bg-primary w-full py-4 text-white"
                                : "text-lg md:text-2xl w-full py-4 bg-white text-primary rounded-tr-lg"
                        }
                        onClick={() => {
                            setSignedIn(false);
                            router.push("/login");
                        }}
                    >
                        Login
                    </button>
                </div>
                <h1 className="text-2xl md:text-4xl text-black text-center mt-8 md:mt-[4rem] font-bold">
                    Welcome Back
                </h1>
                <form
                    method="post"
                    action="/api/auth/signin/email"
                    onSubmit={handleSubmit(onLogin)}
                    className="mx-auto mt-8 md:mt-[4rem] w-[90%] md:w-[80%] pb-8"
                >
                    <Input
                        label="Email"
                        name="email"
                        placeholder="Email"
                        type="email"
                        register={register}
                        errors={errors}
                    />
                    <Input
                        label="Password"
                        name="password"
                        placeholder="Password"
                        type="password"
                        register={register}
                        errors={errors}
                    />
                    <Button
                        text="Login"
                        type="submit"
                        variant="primary"
                        handleClick={() => handleSubmit(onLogin)}
                    />
                </form>
                <Button
                    text={`Sign out`}
                    type="button"
                    variant="primary"
                    handleClick={() => signOut()}
                />
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                {/* SHOW PROVIDERS FOR LOGIN */}
                <div>
                    {providers &&
                        Object.values(providers).map((provider) => (
                            <div key={provider.name}>
                                <Button
                                    text={`Sign In with ${provider.name}`}
                                    type="button"
                                    variant="secondary"
                                    handleClick={() => signIn(provider.id)}
                                />
                            </div>
                        ))}
                </div>
            </section>
        </div>
    );
};

export default Login;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);

    const csrfToken = await getCsrfToken(context);

    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    const providers = await getProviders();

    return {
        props: {
            providers: providers ?? [],
            csrfToken: csrfToken ?? "",
        },
    };
}
