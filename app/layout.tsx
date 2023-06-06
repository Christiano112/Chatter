import "./globals.css";
import { Inter } from "next/font/google";
import CustomLayout from "./custom_layout";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata = {
    title: "Chatter",
    description: "A Chat/Blog Webapp by Christian Enyia",
    charset: "utf-8",
};

interface LayoutProps {
    children: React.ReactNode;
    session: any;
}

export default function RootLayout({ children, session }: LayoutProps) {
    return (
        <html lang="en">
            <body className={`${inter.className} mx-auto w-[98%] p-0 box-border`}>
                <CustomLayout session={session}>{children}</CustomLayout>
            </body>
        </html>
    );
}
