import React, { ReactNode } from "react";

export interface SignInResponse {
    error: string | undefined;
    status: number;
    ok: boolean;
    url: string | null;
}
interface ButtonType {
    text: ReactNode;
    handleClick?: (data: any) => void | (() => void) | Promise<SignInResponse | undefined>;
    type: "submit" | "reset" | "button";
    variant?: "primary" | "secondary" | "tertiary";
    size?: "small" | "medium" | "large";
    style?: React.CSSProperties;
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
            return "w-[12rem";
        case "large":
            return "w-1/2";
        default:
            return "w-full";
    }
};

const Button = ({ text, type, variant, handleClick, size, ...props }: ButtonType) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const className = `btn ${getVariantClass(variant)} ${getSizeClass(size)} ${
        isHovered ? "hover:bg-opacity-90 outline outline-1" : ""
    }`;

    return (
        <React.Fragment>
            <button
                onClick={handleClick}
                type={type}
                className={className}
                {...props}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {text}
            </button>
        </React.Fragment>
    );
};

export default Button;
