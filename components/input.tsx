import Image from "next/image";
import React from "react";
import EyeIcon from "/public/eye-icon.png";

interface InputType {
    label?: string;
    name: string;
    placeholder?: string;
    type: string;
    register: any;
    errors?: any;
}

const Input = ({ label, name, placeholder, type, register, errors, ...props }: InputType) => {
    const [inputType, setInputType] = React.useState(type);

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
                    autoComplete={
                        name === "confirmPassword"
                            ? "new-password"
                            : "password"
                            ? "current-password"
                            : type
                    }
                    placeholder={placeholder}
                    className="p-1 md:p-2 rounded cursor-text text-lg border outline-none bg-white placeholder:text-slate-500 focus:border-blue-800 w-full"
                    {...props}
                />
                {type === "password" && (
                    <span
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={toggleInputType}
                    >
                        <Image src={EyeIcon} alt="eye-icon" className="mix-blend-color-burn" />
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
