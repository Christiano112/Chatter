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
import { useAppDispatch, useAppSelector } from "@/store/store";
import { login } from "@/store/slices/user";

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
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });
    const router = useRouter();

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
        <React.Fragment>
            <form
                method="post"
                action="/api/auth/signin/email"
                onSubmit={handleSubmit(onLogin)}
                className="mx-auto my-20 w-3/4 shadow-inner rounded-lg p-4 md:p-8 bg-slate-300"
            >
                <div>
                    {/* SHOW PROVIDERS FOR LOGIN */}
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
                    <Button
                        text={`Sign out`}
                        type="button"
                        variant="secondary"
                        handleClick={() => signOut()}
                    />
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                </div>
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
                    variant="secondary"
                    handleClick={() => handleSubmit(onLogin)}
                />
            </form>
        </React.Fragment>
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
