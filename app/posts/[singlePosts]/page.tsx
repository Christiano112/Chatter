"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { shallowEqual } from "react-redux";
import ReactionButton from "@/components/reactions";
import { useAppSelector } from "@/redux/store";
import { selectPostById } from "@/redux/slices/posts";

const SinglePost = () => {
    const pathname = usePathname();

    const lastPath = pathname.split("/");
    const id = lastPath[lastPath.length - 1];

    const post = useAppSelector((state) => selectPostById(state, id), shallowEqual);

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div className="p-2">
            <p>id: {post.id}</p>
            <h1>title: {post.title}</h1>
            <p>content: {post.content}</p>
            <p>date: {post.date}</p>
            <p>author: {post.user}</p>
            {post.reactions && <ReactionButton post={post} />}
        </div>
    );
};

export default SinglePost;
