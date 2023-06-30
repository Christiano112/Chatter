"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import parse from "html-react-parser";
import ReactionButton from "@/components/reactions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { shallowEqual } from "react-redux";
import BookIcon from "@/public/book-icon.png";
import CommentIcon from "@/public/comment-icon.png";
import ProfilePic from "@/public/man.png";
import supaBase from "@/utils/supabase";
import calculateReadingTime from "@/utils/reading_time";
import { formatDateTimeShort } from "@/utils/date";
import { formatName } from "@/utils/format";
import { usePathId } from "@/utils/custom";
import { ErrorToast } from "@/components/toast";
import NotFound from "@/components/not-found";
import Loading from "@/app/loading";
import { PostType, selectPostById } from "@/redux/slices/posts";
import { addComment } from "@/redux/slices/comments";
import { selectUser } from "@/redux/slices/user";

const SingleFeed = () => {
    const pathId = usePathId();
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPostComments, setSelectedPostComments] = useState<any[]>([]);
    const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
    const [post, setPost] = useState<any>(
        useAppSelector((state) => selectPostById(state, pathId), shallowEqual),
    );
    const [newComment, setNewComment] = useState("");
    const readingTime = calculateReadingTime(post?.content) + " mins";
    const commentsCount = Object.keys(post?.comments ?? {}).length;

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true);
                let { data: post, error } = await supaBase
                    .from("posts")
                    .select(
                        `*,
                    author:users(first_name, last_name, username, join_as),
                    comments:comments(id)`,
                    )
                    .eq("post_id", pathId)
                    .order("created_at", { ascending: false });

                if (error || !post) {
                    ErrorToast(error?.message ?? "Error fetching updated post");
                    return;
                }

                setPost(post[0]);
            } catch (error: any) {
                ErrorToast(error?.message ?? "Error fetching updated post");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [pathId]);

    if (isLoading) {
        return <Loading />;
    }

    const fetchCommentsForPost = async (post_id: string) => {
        let { data: comments, error: commentsError } = await supaBase
            .from("comments")
            .select(
                `
                    *,
                    author:users(first_name, last_name, username)
                `,
            )
            .eq("comment_id", post_id);

        if (commentsError || !comments) {
            ErrorToast(commentsError?.message ?? "Error fetching comments");
            return;
        }

        setSelectedPostComments(comments);
    };

    const handleCommentClick = async (post: any) => {
        setNewComment("");
        setSelectedPost(post);
        await fetchCommentsForPost(post.post_id);
    };

    const handleAddComment = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!newComment.trim()) {
            ErrorToast("Comment cannot be empty");
            return;
        }

        const { data: comment, error } = await supaBase
            .from("comments")
            .insert([
                {
                    author_id: user?.user_id,
                    comment_id: post.post_id,
                    content: newComment,
                },
            ])
            .select();

        if (error || !comment) {
            ErrorToast(error?.message ?? "Error adding comment");
            return;
        }

        dispatch(addComment(comment[0]));

        setNewComment("");
    };

    return (
        <div className="rounded-lg shadow-inner px-2 sm:px-4 md:px-8 py-4">
            {!post || Object.keys(post).length === 0 ? (
                <NotFound text="Post not found" />
            ) : (
                <div key={post?.post_id} className="border-b-2 border-b-slate-700 p-2 sm:p-4">
                    <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                        <Image src={ProfilePic} alt="profile pic" className="rounded-full" />
                        <div className="flex flex-col gap-3">
                            <h4 className="font-medium text-2xl text-tertiary">
                                {post?.author?.first_name} {post?.author?.last_name}
                            </h4>
                            <p className="text-tertiary-50 capitalize">
                                {post?.author?.join_as ?? "Unknown"},{" "}
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
                    <div className="flex items-center justify-between gap-4 border-2 px-2 py-4">
                        <button
                            className="flex items-center gap-1 outline-0 select-none"
                            onClick={() => handleCommentClick(post)}
                        >
                            <Image src={CommentIcon} alt="comment icon" />
                            <p className="text-tertiary-50">{commentsCount}</p>
                        </button>
                        {<ReactionButton post={post} />}
                    </div>
                    {selectedPost && selectedPost.post_id === post.post_id && (
                        <div className="flex z-50 items-center justify-center gap-4">
                            <div className="bg-white rounded shadow-lg px-2 py-4 w-full flex-grow">
                                <h3 className="font-semibold text-xl md:text-2xl mb-4 ml-2">
                                    Comments
                                </h3>
                                {/* Render comments for selected post */}
                                {selectedPostComments &&
                                    selectedPostComments?.map((comment) => {
                                        const initials = formatName(
                                            comment.author.first_name,
                                            comment.author.last_name,
                                        );
                                        return (
                                            <div
                                                key={comment.id}
                                                className="flex items-center gap-2 mb-4 border-b"
                                            >
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                                                    {initials}
                                                </div>
                                                <div className="flex flex-col">
                                                    <h4 className="font-medium text-tertiary">
                                                        {comment.author?.username} {`:`}
                                                    </h4>
                                                    <p className="text-tertiary-50">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                {/* Comment input */}
                                <form className="flex items-center mt-4">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        className="px-4 py-2 border rounded flex-grow"
                                        required
                                        spellCheck={true}
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 ml-4 text-white bg-primary rounded outline-0 select-none"
                                        onClick={handleAddComment}
                                    >
                                        Comment
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SingleFeed;
