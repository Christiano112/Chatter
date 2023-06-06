import React from "react";

interface InputType {
    label?: string;
    name: string;
    placeholder?: string;
    type: string;
    register: any;
    errors?: any;
}

const Input = ({ label, name, placeholder, type, register, errors, ...props }: InputType) => {
    return (
        <div className="flex flex-col gap-2 my-8">
            {label && (
                <label htmlFor={name} className="text-sm md:text-lg text-slate-800">
                    {`${label} :`}
                </label>
            )}
            <input
                type={type}
                id={name}
                {...register(
                    name,
                    { required: true },
                    type === "password" && {
                        minLength: { value: 8, message: "Password must be at least 8 characters" },
                    },
                    type === "email" && {
                        pattern: {
                            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2, 3})+$/,
                            message: "Invalid email address",
                        },
                    },
                )}
                aria-invalid={errors[name] ? "true" : "false"}
                autoSave="true"
                autoCorrect="on"
                spellCheck={name !== "password" ? "true" : "false"}
                autoComplete={
                    name === "password"
                        ? "new-password"
                        : "confirmPassword"
                        ? "current-password"
                        : type
                }
                placeholder={placeholder}
                className="p-1 md:p-2 rounded cursor-text text-sm md:text-lg border outline-none bg-white placeholder:text-slate-500 focus:border-blue-800"
                {...props}
            />
            {errors[name] && (
                <span role="alert" className="text-sm text-red-700">
                    {errors[name].message}
                </span>
            )}
        </div>
    );
};

export default Input;
