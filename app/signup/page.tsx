"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { object, string, ref } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { SuccessToast, ErrorToast } from "@/components/toast";
import Input from "@/components/input";
import Button from "@/components/button";

const signUpSchema = object({
    name: string().trim().required("Name is required"),
    username: string().trim().required("Username is required"),
    email: string().trim().email("Email must be a valid email").required("Email is required"),
    password: string()
        .trim()
        .min(8, "Password must be a minimum of 8 characters")
        .required("Password is required"),
    confirmPassword: string()
        .trim()
        .min(8, "Password must be a minimum of 8 characters")
        .oneOf([ref("password"), undefined], "Passwords must match")
        .required("Password is required"),
});

const SignUp = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signUpSchema),
    });
    const router = useRouter();

    const onSignUp = (data: any) => {
        console.log(data);
        SuccessToast("Sign Up Successful");

        // Redirect to login page
        router.push("/login");
    };

    return (
        <React.Fragment>
            <form
                onSubmit={handleSubmit(onSignUp)}
                className="mx-auto my-20 w-3/4 shadow-inner rounded-lg p-4 md:p-8 bg-slate-300"
            >
                <Input
                    label="Name"
                    name="name"
                    placeholder="Enter your name"
                    type="text"
                    register={register}
                    errors={errors}
                />
                <Input
                    label="Username"
                    name="username"
                    placeholder="Enter your username"
                    type="text"
                    register={register}
                    errors={errors}
                />
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
                <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    type="password"
                    register={register}
                    errors={errors}
                />
                <Button
                    text="Sign Up"
                    type="submit"
                    variant="primary"
                    handleClick={() => handleSubmit(onSignUp)}
                />
            </form>
        </React.Fragment>
    );
};

export default SignUp;
