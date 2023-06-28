"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { shallowEqual } from "react-redux";
import ReactionButton from "@/components/reactions";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { deletePost, fetchPosts, selectPostById, selectPostsByAuthor } from "@/redux/slices/posts";
import { formatDateTimeShort } from "@/utils/date";

const SinglePost = () => {
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const lastPath = pathname.split("/");
    const id = lastPath[lastPath.length - 1];

    const post = useAppSelector((state) => selectPostById(state, id), shallowEqual);

    // console.log("post", post);

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div className="p-2">
            <p>id: {post?.post_id}</p>
            <h1>title: {post?.title}</h1>
            <p>content: {post?.content}</p>
            <p>date: {formatDateTimeShort(post?.created_at)}</p>
            <p>author: {post?.author_id}</p>
            {post?.reactions && <ReactionButton post={post} />}
            <button onClick={() => dispatch(deletePost(post?.post_id))}>Delete Post</button>
        </div>
    );
};

export default SinglePost;
