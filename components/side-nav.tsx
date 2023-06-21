"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import Button from "./button";
import TrendingIcon from "../public/trending-icon.png";
import FeedIcon from "../public/feed-icon.png";
import BookmarkIcon from "../public/bookmark-icon.png";
import TeamBlogsIcon from "../public/team-icon.png";
import DraftIcon from "../public/draft-icon.png";
import AnalyticsIcon from "../public/analytics-icon.png";
import AccountIcon from "../public/account-icon.png";
import NotificationIcon from "../public/notification-icon.png";

const SideNav = () => {
    return (
        <div className="hidden md:block max-w-[13rem] p-4 shadow-2xl transition-all relative h-full z-50 transition duration-150 ease-out md:ease-in">
            <h2 className="text-primary font-bold text-4xl md:text-5xl mb-8">Chatter</h2>
            <div className="flex flex-col gap-4 mb-8">
                <h3 className="text-tertiary text-xl font-medium">Overview</h3>
                <Link href="/" className="flex gap-2 items-center text-tertiary-50 footer-link">
                    <span>
                        <Image src={FeedIcon} alt="feed icon" />
                    </span>{" "}
                    Feed
                </Link>
                <Link href="/" className="flex gap-2 items-center text-tertiary-50 footer-link">
                    <span>
                        <Image src={BookmarkIcon} alt="bookmark icon" />
                    </span>{" "}
                    Bookmarks
                </Link>
                <Link href="/" className="flex gap-2 items-center text-tertiary-50 footer-link">
                    <span>
                        <Image src={TeamBlogsIcon} alt="blog icon" />
                    </span>{" "}
                    Team Blogs
                </Link>
                <Link href="/" className="flex gap-2 items-center text-tertiary-50 footer-link">
                    <span>
                        <Image src={DraftIcon} alt="drafts icon" />
                    </span>{" "}
                    Drafts
                </Link>
                <Link href="/" className="flex gap-2 items-center text-tertiary-50 footer-link">
                    <span>
                        <Image src={AnalyticsIcon} alt="analytics icon" />
                    </span>{" "}
                    Analytics
                </Link>
            </div>
            <div className="flex flex-col gap-4 mb-8">
                <h3 className="flex gap-2 items-center text-tertiary text-xl font-medium">
                    Trending Tags{" "}
                    <span>
                        <Image src={TrendingIcon} alt="trending icon" />
                    </span>
                </h3>
                <Link href="/" className="text-tertiary-50 footer-link">
                    Programming
                </Link>
                <Link href="/" className="text-tertiary-50 footer-link">
                    Data Science
                </Link>
                <Link href="/" className="text-tertiary-50 footer-link">
                    Technology
                </Link>
                {/* <Link href="/" className="text-tertiary-50 footer-link">
                    Machine Learning
                </Link>
                <Link href="/" className="text-tertiary-50 footer-link">
                    Politics
                </Link>
                <Link href="/" className="text-primary underline underline-offset-4">
                    See all
                </Link> */}
            </div>
            <div className="flex flex-col gap-4 mb-8">
                <h3 className="text-tertiary text-xl font-medium">Personal</h3>
                <Link
                    href="/account"
                    className="flex gap-2 items-center text-tertiary-50 footer-link"
                >
                    <span>
                        <Image src={AccountIcon} alt="account icon" />
                    </span>{" "}
                    Account
                </Link>
                <Link
                    href="/notification"
                    className="flex gap-2 items-center text-tertiary-50 footer-link"
                >
                    <span>
                        <Image src={NotificationIcon} alt="notification icon" />
                    </span>{" "}
                    Notifications
                </Link>
                <div className="justify-end bottom-0 absolute right-0 left-0 p-4 mb-[-1rem]">
                    <Button
                        text={`Log out`}
                        type="button"
                        handleClick={() => signOut()}
                        style={{ border: "1px solid red", color: "red" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SideNav;
