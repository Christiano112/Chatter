"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { loginSchema, signUpSchema } from "./schema";

export interface LoginType {
    email: string;
    password: string;
}

export interface SignUpType {
    first_name: string;
    last_name: string;
    username: string;
    join_as: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const useLoginForm = (onSubmit: (arg0: LoginType) => void) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginType>({
        resolver: yupResolver(loginSchema),
    });

    const handleFormSubmit = handleSubmit((data) => {
        onSubmit(data);
    });

    return {
        register,
        handleFormSubmit,
        errors,
    };
};

const useSignUpForm = (onSubmit: (arg0: SignUpType) => void) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpType>({
        resolver: yupResolver(signUpSchema),
    });

    const handleFormSubmit = handleSubmit((data) => {
        onSubmit(data);
    });

    return {
        register,
        handleFormSubmit,
        errors,
    };
};

export { useLoginForm, useSignUpForm };
