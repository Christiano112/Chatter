"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler, LiteralUnion } from "react-hook-form";
import { SuccessToast, ErrorToast } from "@/components/toast";
import Input from "@/components/input";
import Button from "@/components/button";
import {
    useSession,
    signIn,
    getProviders,
    getCsrfToken,
    ClientSafeProvider,
} from "next-auth/react";
import authOptions from "../api/auth/authOptions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { login } from "@/redux/slices/user";
import { BuiltInProviderType } from "next-auth/providers";

export interface LoginType {
    [key: string]: string;
}

export interface LoginPropType {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
    csrfToken: any;
}

const loginSchema = object({
    email: string().trim().email("Must be a valid email").required("Email is required"),
    password: string()
        .trim()
        .min(8, "Password must be a minimum of 8 characters")
        .required("Password is required"),
}).required();

const Login = () => {
    // const { data: session } = useSession();
    // console.log("session", session);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });
    const router = useRouter();
    const [signedIn, setSignedIn] = useState(true);
    const [providers, setProviders] = useState<Record<
        LiteralUnion<BuiltInProviderType, string>,
        ClientSafeProvider
    > | null>();
    const [csrfToken, setCsrfToken] = useState<any>();
    useEffect(() => {
        const fetchProviders = async () => {
            const providers = await getProviders();
            setProviders(providers);
            // const csrfToken = await getCsrfToken(context);
        };
        fetchProviders();
    }, []);

    console.log("providers====", providers);
    const onLogin: SubmitHandler<LoginType> = (data) => {
        // dispatch(login(session?.user));

        SuccessToast("Login Successful");

        // Redirect to homepage
        setTimeout(() => {
            router.push("/feeds");
        }, 3000);
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
                {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
                {/* SHOW PROVIDERS FOR LOGIN */}
                <div>
                    {providers &&
                        Object.values(providers).map((provider) => (
                            <div key={provider.name}>
                                <Button
                                    text={`Sign In with ${provider.name}`}
                                    type="button"
                                    variant="primary"
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
