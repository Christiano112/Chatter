"use client";

import React, { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface ButtonType {
    text: ReactNode;
    handleClick?: any;
    type: "submit" | "reset" | "button";
    variant?: "primary" | "secondary" | "tertiary";
    size?: "small" | "medium" | "large";
    style?: React.CSSProperties;
}

export interface NavigateButtonProps {
    direction?: string;
    text: React.ReactNode;
    size?: "small" | "medium" | "large";
}

const getVariantClass = (variant: ButtonType["variant"]) => {
    switch (variant) {
        case "primary":
            return "bg-primary";
        case "secondary":
            return "bg-secondary";
        case "tertiary":
            return "bg-tertiary";
        default:
            return "bg-white";
    }
};

const getSizeClass = (size: ButtonType["size"]) => {
    switch (size) {
        case "small":
            return "w-[8rem]";
        case "medium":
            return "w-[12rem]";
        case "large":
            return "w-1/2";
        default:
            return "w-full";
    }
};

const Button = ({ text, type, variant, handleClick, size, ...props }: ButtonType) => {
    const [isHovered, setIsHovered] = useState(false);

    const className = `btn ${getVariantClass(variant)} ${getSizeClass(size)} ${
        isHovered ? "hover:bg-opacity-90 outline outline-1" : ""
    }`;

    return (
        <div>
            <button
                onClick={handleClick}
                type={type}
                className={className}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                {...props}
            >
                {text}
            </button>
        </div>
    );
};

export default Button;

export const NavigateButton = ({ direction, text, size, ...props }: NavigateButtonProps) => {
    const router = useRouter();
    return (
        <Button
            text={text}
            type="button"
            variant="primary"
            size={size}
            handleClick={() => router.push(`/${direction}`)}
            {...props}
        />
    );
};

export const SavingSpinner = () => {
    return (
        <span className="flex items-center space-x-2">
            <span className="text-white">Saving</span>
            <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0012 20c4.411 0 8-3.589 8-8h-4a4 4 0 11-8 0v3.291z"
                />
            </svg>
        </span>
    );
};
