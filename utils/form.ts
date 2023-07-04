"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { loginSchema, signUpSchema, updateUserSchema, socialLinkSchema } from "./schema";

export const professions = [
    "Chef",
    "Database Administrator",
    "IT Support Specialist",
    "Software Engineer",
    "UX/UI Designer",
    "Web Developer",
    "Nurse",
    "Teacher",
    "Marketing Manager",
    "Cybersecurity Analyst",
    "Network Administrator",
    "Writer",
    "Data Scientist",
    "Systems Analyst",
    "Product Manager",
];

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

export interface UpdateUserType {
    first_name?: string;
    last_name?: string;
    username?: string;
    join_as?: string;
    email?: string;
}

export interface SocialLinkType {
    [key: string]: string;
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

const useUpdateUserForm = (onSubmit: (arg0: UpdateUserType) => void) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(updateUserSchema),
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

const useSocialLinkForm = (onSubmit: (arg0: SocialLinkType) => void) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(socialLinkSchema),
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

export { useLoginForm, useSignUpForm, useUpdateUserForm, useSocialLinkForm };
