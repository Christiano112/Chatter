"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/button";
import Logo from "@/public/logo.png";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaAlignRight } from "react-icons/fa";
import { useCheckAuth } from "@/utils/custom";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, authenticated } = useCheckAuth();
    const pathname = usePathname();
    const router = useRouter();

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
                            <Link href="/feeds" className={`${isActive("/feeds")} link`}>
                                Feeds
                            </Link>
                        </li>
                        <li>
                            <Link href="/editor" className={`${isActive("/editor")} link`}>
                                Editor
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
                        handleClick={() => router.push(`/profile/${user?.id}`)}
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
