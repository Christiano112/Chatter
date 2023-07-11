"use client";

import parse from "html-react-parser";
import Image from "next/image";
import { shallowEqual } from "react-redux";
import BookIcon from "@/public/book-icon.png";
import ProfilePic from "@/public/man.png";
import { deletePost, selectPostsByStatus } from "@/redux/slices/posts";
import { selectUser } from "@/redux/slices/user";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { formatDateTimeShort } from "@/utils/date";
import calculateReadingTime from "@/utils/reading_time";
import NotFound from "./not-found";

const DraftPost = () => {
    const dispatch = useAppDispatch();
    const { user, posts } = useAppSelector(
        (state) => ({
            user: selectUser(state),
            posts: selectPostsByStatus(state, "draft"),
        }),
        shallowEqual,
    );

    if (!posts || posts.length === 0) {
        return <NotFound text="Post not found" />;
    }

    return (
        <>
            {posts.map((post) => {
                const readingTime = calculateReadingTime(post?.content) + " mins";
                return (
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
                            onClick={() => dispatch(deletePost(post.post_id))}
                        >
                            Delete
                        </button>
                    </div>
                );
            })}
        </>
    );
};

export default DraftPost;
