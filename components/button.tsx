"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface ButtonType {
    text: ReactNode;
    handleClick?: any;
    type: "submit" | "reset" | "button";
    variant?: "primary" | "secondary" | "tertiary";
    size?: "small" | "medium" | "large";
    style?: React.CSSProperties;
}

export interface NavigateBtnProps {
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

export const NavigateBtn = ({ direction, text, size, ...props }: NavigateBtnProps) => {
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
