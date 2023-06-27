"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { shallowEqual } from "react-redux";
import ReactionButton from "@/components/reactions";
import { useAppSelector } from "@/redux/store";
import { fetchPosts, selectPostById, selectPostsByAuthor } from "@/redux/slices/posts";
import { formatDateTimeShort } from "@/utils/date";

const SinglePost = () => {
    const pathname = usePathname();
    const lastPath = pathname.split("/");
    const id = lastPath[lastPath.length - 1];

    const post = useAppSelector((state) => selectPostById(state, id), shallowEqual);

    console.log("post", post);

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div className="p-2">
            <p>id: {post.post_id}</p>
            <h1>title: {post.title}</h1>
            <p>content: {post.content}</p>
            <p>date: {formatDateTimeShort(post.created_at)}</p>
            <p>author: {post.author_id}</p>
            {post.reactions && <ReactionButton post={post} />}
        </div>
    );
};

export default SinglePost;
