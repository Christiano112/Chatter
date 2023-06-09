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
    variant?: "primary" | "secondary";
    size?: "small" | "medium" | "large";
}

const basicStyle =
    "cursor-pointer text-white rounded-lg shadow-lg select-none px-4 py-2 text-sm md:text-lg whitespace-nowrap text-center my-4";

const getVariantClass = (variant: ButtonType["variant"]) => {
    switch (variant) {
        case "primary":
            return "bg-primary";
        case "secondary":
            return "bg-secondary";
        default:
            return "bg-tertiary";
    }
};

const getSizeClass = (size: ButtonType["size"]) => {
    switch (size) {
        case "small":
            return "w-[1/4]";
        case "medium":
            return "w-[1/2]";
        case "large":
            return "w-[3/4]";
        default:
            return "w-full";
    }
};

const Button = ({ text, type, variant, handleClick, size, ...props }: ButtonType) => {
    const className = `${getVariantClass(variant)} ${basicStyle} ${getSizeClass(size)}`;

    return (
        <React.Fragment>
            <button onClick={handleClick} type={type} className={className} {...props}>
                {text}
            </button>
        </React.Fragment>
    );
};

export default Button;
