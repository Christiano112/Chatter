"use client";

import React from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/slices/user";
import SearchInput from "@/components/search";
import NotificationIcon from "@/public/notification-icon.png";
import AccountIcon from "../public/account-icon.png";

const Feed = () => {
    const user = useAppSelector(selectUser);

    const handleSearch = (query: string) => {
        // Perform the search operation using the provided query
        // Update the search results or navigate to a search results page
        console.log("Performing search:", query);
    };

    console.log("user", user);

    return (
        <div>
            <header>
                <SearchInput placeholder="Search..." onSearch={handleSearch} />
                <div>
                    <Image src={NotificationIcon} alt="notification icon" />
                    {/* <Image src={user ? user?.userState : AccountIcon} alt='profile pic' /> */}
                </div>
            </header>
        </div>
    );
};

export default Feed;
