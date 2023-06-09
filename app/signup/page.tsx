"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { object, string, ref } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { SuccessToast, ErrorToast } from "@/components/toast";
import Input from "@/components/input";
import Button from "@/components/button";
import Select from "@/components/select";

const signUpSchema = object({
    firstName: string().trim().required("First Name is required"),
    lastName: string().trim().required("Last Name is required"),
    username: string().trim().required("Username is required"),
    joinAs: string().trim().required("Select an option"),
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
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signUpSchema),
    });
    const router = useRouter();
    const [signedIn, setSignedIn] = React.useState(true);

    const onSignUp = (data: any) => {
        console.log(data);
        SuccessToast("Sign Up Successful");

        // Redirect to login page
        router.push("/login");
    };

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
            <section className="w-full mt-10 flex flex-col items-center">
                <div className="w-full flex justify-evenly bg-white shadow-lg rounded-t-lg">
                    <button
                        className={
                            signedIn
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
                            !signedIn
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
                    Register as a Writer/Reader
                </h1>
                <form
                    onSubmit={handleSubmit(onSignUp)}
                    className="mx-auto mt-8 md:mt-[4rem] w-[90%] md:w-[80%] pb-8"
                >
                    <div className="flex flex-col lg:flex-row gap-0 lg:gap-4 lg:items-center lg:justify-between">
                        <Input
                            label="First Name"
                            name="firstName"
                            placeholder="Enter your first name"
                            type="text"
                            register={register}
                            errors={errors}
                        />
                        <Input
                            label="Last Name"
                            name="lastName"
                            placeholder="Enter your last name"
                            type="text"
                            register={register}
                            errors={errors}
                        />
                    </div>
                    <Input
                        label="Username"
                        name="username"
                        placeholder="Enter your username"
                        type="text"
                        register={register}
                        errors={errors}
                    />
                    <Select
                        label="You are joining as"
                        name="joinAs"
                        register={register}
                        options={["writer", "reader"]}
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
                        text="Create account"
                        type="submit"
                        variant="primary"
                        handleClick={() => handleSubmit(onSignUp)}
                    />
                </form>
            </section>
        </div>
    );
};

export default SignUp;
