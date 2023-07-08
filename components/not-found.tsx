import { NavigateButton } from "./button";

interface NotFoundProps {
    text: string;
}

const NotFound = ({ text }: NotFoundProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-gray-800 overflow-hidden">
            <h1 className="text-4xl font-bold">{text}</h1>
            <NavigateButton text="Go to Feeds" direction="feeds" size="small" />
        </div>
    );
};

export default NotFound;
