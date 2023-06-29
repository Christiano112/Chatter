"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@supabase/auth-helpers-react";
import Button from "@/components/button";
import Logo from "@/public/logo.png";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaAlignRight } from "react-icons/fa";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const user = useUser();

    useEffect(() => {
        if (user && user.role === "authenticated" && user.id) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
    }, [user]);

    const isActive = (href: string) => (pathname === href ? "text-primary" : "text-tertiary");

    return (
        <header className="shadow">
            <nav className="container-fluid mx-auto flex items-center justify-between p-2 2xs:p-4">
                <div className="flex items-center cursor-pointer">
                    <Image
                        src={Logo}
                        alt="logo"
                        width={80}
                        height={80}
                        priority
                        className="min-h-[3rem] min-w-[3rem]"
                    />
                </div>
                {/* <div className={`2xs:flex ${isOpen ? 'block' : 'hidden'}`}> */}
                <div className="hidden sm:block flex-grow text-center">
                    <ul className="flex justify-center space-x-4">
                        <li>
                            <Link href="/" className={`${isActive("/")} link`}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className={`${isActive("/Feeds")} link`}>
                                Feeds
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className={`${isActive("/posts")} link`}>
                                Posts
                            </Link>
                        </li>
                    </ul>
                </div>
                {authenticated ? (
                    <Button
                        text="Profile"
                        type="button"
                        variant="primary"
                        size="small"
                        handleClick={() => router.push("/profile")}
                    />
                ) : (
                    <div className="flex items-center space-x-4">
                        <Button
                            text="Login"
                            type="button"
                            size="small"
                            style={{ border: "1px solid #543EE0", color: "#111111" }}
                            handleClick={() => router.push("/login")}
                        />
                        <Button
                            text="Sign up"
                            type="button"
                            variant="primary"
                            size="small"
                            handleClick={() => router.push("/signup")}
                        />
                    </div>
                )}
                {/* </div> */}
                <FaAlignRight
                    className="text-primary hidden cursor-pointer w-8 h-8"
                    onClick={() => setIsOpen(!isOpen)}
                />
            </nav>
        </header>
    );
};

export default Header;
