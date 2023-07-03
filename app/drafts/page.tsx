"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import parse from "html-react-parser";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { deletePost, selectPostsByStatus } from "@/redux/slices/posts";
import { selectUser } from "@/redux/slices/user";
import { ErrorToast } from "@/components/toast";
import { formatDateTimeShort } from "@/utils/date";
import Loading from "@/app/loading";
import calculateReadingTime from "@/utils/reading_time";
import BookIcon from "@/public/book-icon.png";
import ProfilePic from "@/public/man.png";
import NotFound from "@/components/not-found";
import Header from "@/components/header";

const Drafts = () => {
    const dispatch = useAppDispatch();
    const posts = useAppSelector((state) => selectPostsByStatus(state, "draft"));
    const user = useAppSelector(selectUser);
    const excerptLimit = 500;
    const [isLoading, setIsLoading] = useState(false);

    return (
        <React.Fragment>
            <Header />
            <h1 className="px-4 my-8 text-center text-2xl sm:text-4xl text-primary">
                My Draft Posts
            </h1>
            <div className="rounded-lg shadow-inner px-2 sm:px-4 py-4 m-4">
                {isLoading ? (
                    <Loading />
                ) : !posts || posts.length === 0 ? (
                    <NotFound text="No more posts" />
                ) : (
                    posts.map((post) => {
                        const readingTime = calculateReadingTime(post?.content) + " mins";
                        const contentLength = post?.content.length || 0;
                        const excerpt = post?.content.slice(0, excerptLimit);
                        return (
                            <div
                                key={post?.post_id}
                                className="border-b-2 border-b-slate-700 p-2 sm:p-4"
                            >
                                <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                                    <Link href={`/profile/${user?.user_id}`}>
                                        <Image
                                            src={ProfilePic}
                                            alt="profile pic"
                                            className="rounded-full cursor-pointer"
                                        />
                                    </Link>
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            href={`/profile/${user?.user_id}`}
                                            className="font-medium text-2xl text-tertiary cursor-pointer"
                                        >
                                            {user?.first_name} {user?.last_name}
                                        </Link>
                                        <p className="text-tertiary-50 capitalize">
                                            {user?.join_as},{" "}
                                            <span className="font-medium">
                                                {formatDateTimeShort(post?.created_at)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 my-8">
                                    <h3 className="font-semibold text-2xl md:text-4xl text-tertiary">
                                        {post?.title}
                                    </h3>
                                    <h6 className="flex gap-2 items-center text-tertiary-50 text-sm">
                                        <span>
                                            <Image src={BookIcon} alt="book icon" />
                                        </span>{" "}
                                        {readingTime}
                                    </h6>
                                    <div className="text-tertiary-50">
                                        {parse(excerpt)}
                                        {contentLength > excerptLimit && (
                                            <Link
                                                href={`/drafts/${post?.post_id}`}
                                                className="underline text-primary cursor-pointer"
                                                target="_blank"
                                            >
                                                Read more...
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </React.Fragment>
    );
};

export default Drafts;
