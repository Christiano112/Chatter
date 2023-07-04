import { object, string, ref } from "yup";

export const signUpSchema = object({
    first_name: string().trim().required("First Name is required"),
    last_name: string().trim().required("Last Name is required"),
    username: string().trim().required("Username is required"),
    join_as: string().trim().required("Select an option"),
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

export const loginSchema = object({
    email: string().trim().email("Must be a valid email").required("Email is required"),
    password: string()
        .trim()
        .min(8, "Password must be a minimum of 8 characters")
        .required("Password is required"),
}).required();

export const updateUserSchema = object({
    first_name: string().trim(),
    last_name: string().trim(),
    username: string().trim(),
    join_as: string().trim(),
    email: string().trim().email("Must be a valid email"),
});

export const socialLinkSchema = object({
    facebook_link: string().trim().url("Must be a valid URL"),
    twitter_link: string().trim().url("Must be a valid URL"),
    instagram_link: string().trim().url("Must be a valid URL"),
    linkedin_link: string().trim().url("Must be a valid URL"),
    github_link: string().trim().url("Must be a valid URL"),
    medium_link: string().trim().url("Must be a valid URL"),
    youtube_link: string().trim().url("Must be a valid URL"),
    website_link: string().trim().url("Must be a valid URL"),
});
