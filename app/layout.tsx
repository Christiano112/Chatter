import "./globals.css";
import { Inter } from "next/font/google";
import { Session } from "next-auth";
import { Analytics } from "@vercel/analytics/react";
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
    session: Session | null;
}

export default function RootLayout({ children, session }: LayoutProps) {
    return (
        <html lang="en">
            <body className={`${inter.className} m-0 p-0 box-border`}>
                <CustomLayout session={session}>
                    {children}
                    <Analytics />
                </CustomLayout>
            </body>
        </html>
    );
}
