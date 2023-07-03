"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import parse from "html-react-parser";
import { shallowEqual } from "react-redux";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { deletePost, selectPostById } from "@/redux/slices/posts";
import { formatDateTimeShort } from "@/utils/date";
import { usePathId } from "@/utils/custom";
import NotFound from "@/components/not-found";
import { selectUser } from "@/redux/slices/user";
import calculateReadingTime from "@/utils/reading_time";
import BookIcon from "@/public/book-icon.png";
import ProfilePic from "@/public/man.png";
import Header from "@/components/header";

const SingleDraftPost = () => {
    const dispatch = useAppDispatch();
    const pathId = usePathId();
    const user = useAppSelector(selectUser);
    const post = useAppSelector((state) => selectPostById(state, pathId), shallowEqual);

    if (!post || Object.keys(post).length === 0) {
        return <NotFound text="Post not found" />;
    }

    const readingTime = calculateReadingTime(post?.content) + " mins";

    const handleDelete = () => {
        dispatch(deletePost(post.post_id));
    };

    return (
        <React.Fragment>
            <Header />
            <h1 className="px-4 my-8 text-center text-2xl sm:text-4xl text-primary">
                My Draft Post
            </h1>
            <div className="rounded-lg shadow-inner px-2 sm:px-4 md:px-8 py-4 m-4">
                <div key={post?.post_id} className="border-b-2 border-b-slate-700 p-2 sm:p-4">
                    <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                        <Image src={ProfilePic} alt="profile pic" className="rounded-full" />
                        <div className="flex flex-col gap-3">
                            <h4 className="font-medium text-2xl text-tertiary">
                                {user?.first_name} {user?.last_name}
                            </h4>
                            <p className="text-tertiary-50 capitalize">
                                {user?.join_as ?? "Unknown"},{" "}
                                <span className="font-medium">
                                    {formatDateTimeShort(post?.created_at) ?? "Some time ago"}
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
                        <div className="text-tertiary-50">{parse(post?.content ?? "")}</div>
                    </div>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
};

export default SingleDraftPost;
