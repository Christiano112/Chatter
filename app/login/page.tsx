"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { SuccessToast, ErrorToast } from "@/components/toast";
import Input from "@/components/input";
import Button from "@/components/button";

interface loginType {
    email: string;
    password: string;
}

const loginSchema = object({
    email: string().email().required(),
    password: string().min(8, "Password must be a minimum of 8 characters").required(),
}).required();

const Login = () => {
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
        router.push("/");
    };

    return (
        <React.Fragment>
            <form
                onSubmit={handleSubmit(onLogin)}
                className="mx-auto my-20 w-3/4 shadow-inner rounded-lg p-4 md:p-8 bg-slate-300"
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
                    variant="secondary"
                    handleClick={() => handleSubmit(onLogin)}
                />
            </form>
        </React.Fragment>
    );
};

export default Login;
