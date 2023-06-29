import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import CustomLayout from "./custom_layout";
import { Session } from "@supabase/auth-helpers-react";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata = {
    title: "Chatter",
    description: "A Chat/Blog Webapp by Christian Enyia",
    charset: "utf-8",
};

interface LayoutProps {
    children: ReactNode;
    initialSession: Session;
}

export default function RootLayout({ children, initialSession }: LayoutProps) {
    return (
        <html lang="en">
            <body className={`${inter.className} m-0 p-0 box-border`}>
                <CustomLayout initialSession={initialSession}>{children}</CustomLayout>
            </body>
        </html>
    );
}
