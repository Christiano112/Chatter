"use client";

import Loading from "@/app/loading";
import Header from "@/components/header";
import NotFound from "@/components/not-found";
import ReactionButton from "@/components/reactions";
import { useFecthPostById, useFetchCommentsForPost, usePostInteraction } from "@/hooks/useDBFetch";
import BookIcon from "@/public/book-icon.png";
import CommentIcon from "@/public/comment-icon.png";
import ProfilePic from "@/public/man.png";
import { selectPostById } from "@/redux/slices/posts";
import { selectUser } from "@/redux/slices/user";
import { useAppSelector } from "@/redux/store";
import { usePathId } from "@/utils/custom";
import { formatDateTimeShort } from "@/utils/date";
import { formatName } from "@/utils/format";
import calculateReadingTime from "@/utils/reading_time";
import parse from "html-react-parser";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";

const SingleFeed = () => {
    const pathId = usePathId();
    const user = useAppSelector(selectUser);
    const author_id = user.user_id;
    const [post, setPost] = useState<any>(
        useAppSelector((state) => selectPostById(state, pathId), shallowEqual),
    );
    const { isLoading, post: fetchedPost } = useFecthPostById(pathId);
    const { selectedPostComments, fetchCommentsForPost, setSelectedPostComments } =
        useFetchCommentsForPost();
    const { selectedPost, newComment, handleCommentClick, handleAddComment, setNewComment } =
        usePostInteraction({
            author_id,
            fetchCommentsForPost,
            setSelectedPostComments,
        });

    const readingTime = calculateReadingTime(post?.content) + " mins";
    const commentsCount = Object.keys(post?.comments ?? {}).length;

    useEffect(() => {
        if (fetchedPost.length === 0) return;

        setPost(fetchedPost);
    }, [fetchedPost]);

    if (isLoading) {
        return <Loading />;
    }

    if (!post || Object.keys(post).length === 0) {
        return <NotFound text="Post not found" />;
    }

    return (
        <React.Fragment>
            <Header />
            <div className="rounded-lg shadow-inner px-2 sm:px-4 md:px-8 py-4">
                {
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
                                        selectedPostComments?.map((comment: any) => {
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
                }
            </div>
        </React.Fragment>
    );
};

export default SingleFeed;
