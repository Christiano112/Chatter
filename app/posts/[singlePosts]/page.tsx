"use client";

// import { useEffect } from "react";
import parse from "html-react-parser";
import { shallowEqual } from "react-redux";
import ReactionButton from "@/components/reactions";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { deletePost, selectPostById } from "@/redux/slices/posts";
import { formatDateTimeShort } from "@/utils/date";
import { usePathId } from "@/utils/custom";

const SinglePost = () => {
    const dispatch = useAppDispatch();
    const pathId = usePathId();
    const post = useAppSelector((state) => selectPostById(state, pathId), shallowEqual);

    // console.log("post", post);

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div className="p-2">
            <p>id: {post?.post_id}</p>
            <h1>title: {post?.title}</h1>
            <div>content: {parse(post?.content ?? "")}</div>
            <p>date: {formatDateTimeShort(post?.created_at)}</p>
            <p>author: {post?.author_id}</p>
            {post?.reactions && <ReactionButton post={post} />}
            {/* <button onClick={() => dispatch(deletePost(post?.post_id))}>Delete Post</button> */}
        </div>
    );
};

export default SinglePost;
