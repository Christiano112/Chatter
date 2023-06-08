import React, { ReactNode} from "react";

export interface SignInResponse {
    error: string | undefined;
    status: number;
    ok: boolean;
    url: string | null;
}
interface buttonType {
    text: ReactNode;
    handleClick?: (data: any) => void | (() => void) | Promise<SignInResponse | undefined>;
    type: "submit" | "reset" | "button";
    variant?: "primary" | "secondary";
}

const basicStyle =
    "cursor-pointer text-white rounded-lg shadow-lg select-none w-1/2 md:w-1/4 px-4 py-2 text-sm md:text-lg whitespace-nowrap text-center";

const Button = ({ text, type, variant, handleClick, ...props }: buttonType) => {
    return (
        <React.Fragment>
            <button
                onClick={handleClick}
                type={type}
                className={
                    variant === "primary"
                        ? `bg-blue-800 ${basicStyle}`
                        : variant === "secondary"
                        ? `bg-green-700 ${basicStyle}`
                        : `bg-yellow-600 ${basicStyle}`
                }
                {...props}
            >
                {text}
            </button>
        </React.Fragment>
    );
};

export default Button;
