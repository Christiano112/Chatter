"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/slices/user";
import { fetchPosts, selectAllPosts, selectPostStatus } from "@/redux/slices/posts";
import SearchInput from "@/components/search";
import Button from "@/components/button";
import ReactionButton from "@/components/reactions";
import NotificationIcon from "@/public/notification-icon.png";
import AccountIcon from "@/public/account-icon.png";
import PostIcon from "@/public/post-icon.png";
import BookIcon from "@/public/book-icon.png";
import ViewsIcon from "@/public/view-count-icon.png";
import CommentIcon from "@/public/comment-icon.png";
import ProfilePic from "@/public/man.png";
import DesignImage from "@/public/design.jpg";
import TextEditor from "./../../components/editor";

const Feed = () => {
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const posts = useAppSelector(selectAllPosts);

    const handleSearch = (query: string) => {
        // Perform the search operation using the provided query
        // Update the search results or navigate to a search results page
        console.log("Performing search:", query);
    };

    return (
        <div className="flex-grow shadow-inner rounded">
            <header className="flex items-center justify-between p-8 m-4 gap-8 border shadow">
                <div className="flex-grow text-center">
                    <SearchInput placeholder="Search..." onSearch={handleSearch} />
                </div>
                <div className="flex items-center gap-4 justify-end">
                    <Image src={NotificationIcon} alt="notification icon" />
                    {/* <Image
                        src={user ? user?.image : AccountIcon}
                        alt="profile pic"
                        width={30}
                        height={30}
                    />
                    <p>{user && user.name}</p> */}
                </div>
            </header>

            <main className="shadow-2xl rounded p-8 m-4">
                {showEditor && (
                    <div className="absolute top-5 flex items-center justify-center z-50 mx-auto w-[90%] md:w-[80%]">
                        <div className="bg-white rounded shadow-lg">
                            <TextEditor />
                        </div>
                    </div>
                )}

                <div className="flex items-start sm:items-center justify-between gap-4 sm:gap-8 flex-col sm:flex-row">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-semibold text-2xl md:text-4xl">Feed</h1>
                        <p className="text-tertiary-50">Explore different content you’d love</p>
                    </div>
                    <Button
                        text={
                            <div className="flex gap-2 items-center">
                                <span>
                                    <Image src={PostIcon} alt="post icon" />
                                </span>{" "}
                                Post a content
                            </div>
                        }
                        type="button"
                        variant="primary"
                        size="medium"
                        handleClick={() => setShowEditor(true)}
                    />
                </div>

                <section>
                    <ul className="flex items-center justify-between gap-8 mt-8 px-4 md:px-8 py-4 rounded-lg mb-2 shadow-inner">
                        <li className="text-tertiary font-medium text-xl border-b-8 border-primary hover:cursor-pointer">
                            For you
                        </li>
                        <li className="text-tertiary font-medium text-xl hover:cursor-pointer">
                            Featured
                        </li>
                        <li className="text-tertiary font-medium text-xl hover:cursor-pointer">
                            Recent
                        </li>
                    </ul>
                    <div className="rounded-lg shadow-inner px-4 md:px-8 py-4">
                        <div className="border-b-2 border-b-slate-700 p-4">
                            <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                                <Image
                                    src={ProfilePic}
                                    alt="profile pic"
                                    className="rounded-full"
                                />
                                <div className="flex flex-col gap-3">
                                    <h4 className="font-medium text-2xl text-tertiary">
                                        Grace Ikpang
                                    </h4>
                                    <p className="text-tertiary-50">
                                        Product Designer,{" "}
                                        <span className="font-medium">May 25th 2023</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 my-8">
                                <h3 className="font-semibold text-2xl md:text-4xl text-tertiary mb-4">
                                    Starting out as a product designer
                                </h3>
                                <h6 className="flex gap-2 items-center text-tertiary-50 text-sm">
                                    <span>
                                        <Image src={BookIcon} alt="book icon" />
                                    </span>{" "}
                                    10 mins read
                                </h6>
                                <p className="text-tertiary-50">
                                    Embarking on a journey as a product designer can be an
                                    exhilarating and fulfilling experience. As a profession that
                                    bridges the realms of art, technology, and problem-solving,
                                    product design offers an opportunity to shape the way people
                                    interact with the world around them.
                                </p>
                                <Image
                                    src={DesignImage}
                                    alt="post image"
                                    className="mx-auto w-[90%] rounded"
                                />
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <Image src={CommentIcon} alt="comment icon" />
                                    <p className="text-tertiary-50">200</p>
                                </div>
                                {/* {post.reactions && <ReactionButton post={post} />} */}
                                <div className="flex items-center gap-2">
                                    <Image src={ViewsIcon} alt="views count icon" />
                                    <p className="text-tertiary-50">2980</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Feed;
