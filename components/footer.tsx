import Link from "next/link";
import React from "react";

const Footer = () => {
    return (
        <footer className="bg-secondary-50 p-8 flex flex-col justify-between md:items-center gap-6 md:gap-12 md:flex-row bottom-0 left-0 right-0">
            <h1 className="text-primary font-bold text-5xl flex-grow">Chatter</h1>
            <div className="flex flex-col justify-between gap-6 md:gap-12 flex-grow md:items-center 2xs:flex-row">
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold">Export</h3>
                    <Link href="#" className="footer-link">
                        Community
                    </Link>
                    <Link href="#" className="footer-link">
                        Trending blogs
                    </Link>
                    <Link href="#" className="footer-link">
                        Chatter for teams
                    </Link>
                </div>
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold">Support</h3>
                    <Link href="#" className="footer-link">
                        Support docs
                    </Link>
                    <Link href="#" className="footer-link">
                        Join slack
                    </Link>
                    <Link href="#" className="footer-link">
                        Contact
                    </Link>
                </div>
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold">Official Blog</h3>
                    <Link href="#" className="footer-link">
                        Official blog
                    </Link>
                    <Link href="#" className="footer-link">
                        Engineering blog
                    </Link>
                    <Link href="#" className="footer-link">
                        Documentation
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
