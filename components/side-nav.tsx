import Image from "next/image";
import Link from "next/link";
import AccountIcon from "../public/account-icon.png";
import AnalyticsIcon from "../public/analytics-icon.png";
import BookmarkIcon from "../public/bookmark-icon.png";
import FeedIcon from "../public/feed-icon.png";
import NotificationIcon from "../public/notification-icon.png";
import TeamBlogsIcon from "../public/team-icon.png";
import TrendingIcon from "../public/trending-icon.png";
import SignOutBtn from "./signOutBtn";

const SideNav = () => {
    return (
        <div className="hidden md:block max-w-[13rem] p-4 shadow-2xl relative h-full z-50 transition-all duration-150 ease-out md:ease-in">
            <h2 className="text-primary font-bold text-4xl md:text-5xl mb-8">Chatter</h2>
            <div className="flex flex-col gap-4 mb-8">
                <h3 className="text-tertiary text-xl font-medium">Overview</h3>
                <Link
                    href="/feeds"
                    className="flex gap-2 items-center text-tertiary-50 footer-link"
                >
                    <span>
                        <Image src={FeedIcon} alt="feed icon" />
                    </span>{" "}
                    Feed
                </Link>
                <Link
                    href="/feeds"
                    className="flex gap-2 items-center text-tertiary-50 footer-link"
                >
                    <span>
                        <Image src={BookmarkIcon} alt="bookmark icon" />
                    </span>{" "}
                    Bookmarks
                </Link>
                <Link
                    href="/feeds"
                    className="flex gap-2 items-center text-tertiary-50 footer-link"
                >
                    <span>
                        <Image src={TeamBlogsIcon} alt="blog icon" />
                    </span>{" "}
                    Team Blogs
                </Link>
                <Link
                    href="/feeds"
                    className="flex gap-2 items-center text-tertiary-50 footer-link"
                >
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
                <Link href="/feeds" className="text-tertiary-50 footer-link">
                    Programming
                </Link>
                <Link href="/feeds" className="text-tertiary-50 footer-link">
                    Data Science
                </Link>
                <Link href="/feeds" className="text-tertiary-50 footer-link">
                    Technology
                </Link>
            </div>
            <div className="flex flex-col gap-4 mb-8">
                <h3 className="text-tertiary text-xl font-medium">Personal</h3>
                <Link
                    href="/feeds"
                    className="flex gap-2 items-center text-tertiary-50 footer-link"
                >
                    <span>
                        <Image src={AccountIcon} alt="account icon" />
                    </span>{" "}
                    Account
                </Link>
                <Link
                    href="/feeds"
                    className="flex gap-2 items-center text-tertiary-50 footer-link"
                >
                    <span>
                        <Image src={NotificationIcon} alt="notification icon" />
                    </span>{" "}
                    Notifications
                </Link>
                <div className="justify-end bottom-0 absolute right-0 left-0 p-4 mb-[-1rem]">
                    <SignOutBtn />
                </div>
            </div>
        </div>
    );
};

export default SideNav;
