"use client";

import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface InputType {
    label?: string;
    name: string;
    placeholder?: string;
    type: string;
    register: any;
    errors?: any;
    autoComplete?: string;
}

const Input = ({
    label,
    name,
    placeholder,
    type,
    register,
    errors,
    autoComplete,
    ...props
}: InputType) => {
    const [inputType, setInputType] = useState(type);

    const toggleInputType = () => {
        setInputType("text");
        setTimeout(() => {
            setInputType("password");
        }, 1500);
    };

    return (
        <div className="flex flex-col gap-2 mb-8">
            {label && (
                <label htmlFor={name} className="text-sm md:text-lg text-slate-800">
                    {label}
                </label>
            )}
            <div className="relative w-full">
                <input
                    type={inputType}
                    id={name}
                    {...register(
                        name,
                        { required: true },
                        type === "password" && {
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters",
                            },
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
                    spellCheck={name !== "password" ? "true" : "confirmPassword" ? "true" : "false"}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    className="p-1 md:p-2 rounded cursor-text text-lg border outline-none bg-white placeholder:text-slate-500 focus:border-blue-800 w-full"
                    {...props}
                />
                {type === "password" && (
                    <span
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={toggleInputType}
                    >
                        {inputType === "password" ? (
                            <AiOutlineEyeInvisible className="text-2xl text-slate-500" />
                        ) : (
                            <AiOutlineEye className="text-2xl text-slate-500" />
                        )}
                    </span>
                )}
            </div>
            {errors[name] && (
                <span role="alert" className="text-sm text-red-700">
                    {errors[name].message}
                </span>
            )}
        </div>
    );
};

export default Input;
