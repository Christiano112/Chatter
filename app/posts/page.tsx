"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import parse from "html-react-parser";
import ReactionButton from "@/components/reactions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
    addPost,
    fetchPosts,
    deletePost,
    selectAllPosts,
    selectPostFetchStatus,
} from "@/redux/slices/posts";
import supaBase from "@/utils/supabase";
import type { DatabaseType } from "@/utils/types";
import { selectUser } from "@/redux/slices/user";
import { ErrorToast } from "@/components/toast";
import { formatDateTimeShort } from "@/utils/date";

const Posts = () => {
    const dispatch = useAppDispatch();
    const posts = useAppSelector(selectAllPosts);
    const user = useAppSelector(selectUser);
    const status = useAppSelector(selectPostFetchStatus);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author_id, setAuthorId] = useState("");

    useEffect(() => {
        if (user.user_id) {
            setAuthorId(user.user_id);
        } else {
            ErrorToast("No user found, can't make post");
        }
    }, [user]);

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    // console.log("posts", posts);

    return (
        <div className="p-8">
            <h1>Main Posts Page</h1>
            <div>
                <h1>Posts</h1>
                {posts &&
                    posts.map((post) => (
                        <div
                            key={post?.post_id}
                            className="border p-9 border-red-800 flex flex-col gap-4"
                        >
                            <p>id: {post?.post_id}</p>
                            <h1>title: {post?.title}</h1>
                            <p>content: {parse(post?.content)}</p>
                            <p>date: {formatDateTimeShort(post.created_at)}</p>
                            <p>author: {post?.author_id}</p>
                            {post?.reactions && <ReactionButton post={post} />}
                            <Link href={`/posts/${post?.post_id}`}>View Post</Link>
                            <button onClick={() => dispatch(deletePost(post?.post_id))}>
                                Delete Post
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Posts;
