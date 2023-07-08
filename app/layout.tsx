import { Session } from "@supabase/auth-helpers-react";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import CustomLayout from "./custom_layout";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata = {
    title: "Chatter",
    description: "A Chat/Blog Webapp by Christian Enyia",
    charset: "utf-8",
    author: "Christian Enyia",
    keywords: "chatter, blog, chat, posts, draft, feeds, christian, christian enyia, christiano112",
    metadataBase: new URL("https://chatter-self.vercel.app/"),
    openGraph: {
        title: "Chatter",
        description: "A Chat/Blog Webapp by Christian Enyia",
        type: "website",
        url: "https://chatter-self.vercel.app/",
        image: "/public/logo.png",
        site_name: "Chatter",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        site: "@ChristianoEnyia",
        title: "Chatter",
        description: "A Chat/Blog Webapp by Christian Enyia",
        image: "/public/logo.png",
    },
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
