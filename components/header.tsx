import React from "react";
import Link from "next/link";

const Header = () => {
    return (
        <header className="bg-gray-800 px-8 py-4">
            <nav>
                <ul className="flex gap-4 justify-end text-white">
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/login">Login</Link>
                    </li>
                    <li>
                        <Link href="/signup">Sign Up</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
