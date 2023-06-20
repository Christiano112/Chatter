"use client";

import { useEffect } from "react";
import Link from "next/link";
import { nanoid } from "@reduxjs/toolkit";
import ReactionButton from "@/components/reactions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
    addPost,
    deletePost,
    selectAllPosts,
    fetchPosts,
    selectPostStatus,
} from "@/redux/slices/posts";

const Counter = () => {
    const dispatch = useAppDispatch();
    const posts = useAppSelector(selectAllPosts);
    const status = useAppSelector(selectPostStatus);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchPosts());
        }
    }, [status, dispatch]);

    return (
        <div>
            <div>
                <h1>Posts</h1>
                {posts &&
                    posts.map((post) => (
                        <div key={post.id} className="border p-9 border-red-800">
                            <p>id: {post.id}</p>
                            <h1>title: {post.title}</h1>
                            <p>content: {post.content}</p>
                            <p>date: {post.date}</p>
                            <p>author: {post.user}</p>
                            {post.reactions && <ReactionButton post={post} />}
                            <Link href={`/posts/${post.id}`}>View Post</Link>
                            <button onClick={() => dispatch(deletePost(post.id))}>
                                Delete Post
                            </button>
                        </div>
                    ))}

                <button
                    onClick={() => {
                        const id = nanoid();
                        dispatch(addPost("New Post Title", "New Post Content", id));
                    }}
                >
                    Add Post
                </button>
            </div>
        </div>
    );
};

export default Counter;
