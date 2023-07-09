import Loading from "@/app/loading";
import BookIcon from "@/public/book-icon.png";
import CommentIcon from "@/public/comment-icon.png";
import ProfilePic from "@/public/man.png";
import { formatDateTimeShort, timeAgo } from "@/utils/date";
import { formatName } from "@/utils/format";
import calculateReadingTime from "@/utils/reading_time";
import parse from "html-react-parser";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import NotFound from "./not-found";
import ReactionButton from "./reactions";

interface PostComponentProps {
    isLoading: boolean;
    posts: any[];
    handleReactionUpdate: React.Dispatch<React.SetStateAction<any>>;
    excerptLimit?: number;
    handleCommentClick: (post: any) => void;
    selectedPost: any;
    selectedPostComments: any[];
    handleAddComment: (e: React.FormEvent<HTMLButtonElement>) => void;
    newComment: string;
    setNewComment: React.Dispatch<React.SetStateAction<string>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    page: number;
    pageSize: number;
}

const PostComponent = React.memo(
    ({
        isLoading,
        posts,
        handleReactionUpdate,
        handleCommentClick,
        selectedPost,
        selectedPostComments,
        handleAddComment,
        newComment,
        setPage,
        page,
        pageSize,
        setNewComment,
        excerptLimit = 500,
    }: PostComponentProps) => {
        if (isLoading) {
            return <Loading />;
        }

        if (!posts || posts.length === 0) {
            return <NotFound text="No more posts" />;
        }

        return (
            <div className="rounded-lg shadow-inner px-2 sm:px-4 py-4">
                {posts.map((post) => {
                    if (!post.author) return null;
                    const { user_id, first_name, last_name, join_as } = post?.author;
                    const readingTime = calculateReadingTime(post?.content ?? "") + " mins";
                    const commentsCount = Object.keys(post?.comments ?? {}).length;
                    const contentLength = post?.content?.length || 0;
                    const excerpt = post?.content?.slice(0, excerptLimit) ?? "";
                    return (
                        <div
                            key={post?.post_id}
                            className="border-b-2 border-b-slate-700 p-2 sm:p-4"
                        >
                            <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                                <Link href={`/profile/${user_id}`}>
                                    <Image
                                        src={ProfilePic}
                                        alt="profile pic"
                                        className="rounded-full cursor-pointer"
                                    />
                                </Link>
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href={`/profile/${user_id}`}
                                        className="font-medium text-2xl text-tertiary cursor-pointer"
                                    >
                                        {first_name} {last_name}
                                    </Link>
                                    <p className="text-tertiary-50 capitalize">
                                        {join_as && join_as + ","}{" "}
                                        <span className="font-medium">
                                            {formatDateTimeShort(post?.created_at)}
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
                                <div className="text-tertiary-50">
                                    {parse(excerpt) ?? ""}
                                    {contentLength > excerptLimit && (
                                        <Link
                                            href={`/feeds/${post?.post_id}`}
                                            className="underline text-primary cursor-pointer"
                                        >
                                            Read more...
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-4 border-2 px-2 py-4">
                                <button
                                    className="flex items-center gap-1 outline-0 select-none"
                                    onClick={() => handleCommentClick(post)}
                                >
                                    <Image src={CommentIcon} alt="comment icon" />
                                    <p className="text-tertiary-50">{commentsCount}</p>
                                </button>
                                {
                                    <ReactionButton
                                        post={post}
                                        setUpdatedPost={handleReactionUpdate}
                                    />
                                }
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
                                                if (!comment) return null;
                                                const { author_id, content, created_at } = comment;
                                                const { first_name, last_name, username } =
                                                    comment?.author;
                                                const initials = formatName(first_name, last_name);
                                                const commentTime = timeAgo(created_at);
                                                return (
                                                    <div
                                                        key={comment.id}
                                                        className="flex items-center gap-2 mb-4 border-b"
                                                    >
                                                        <Link
                                                            href={`/profile/${author_id}`}
                                                            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white"
                                                        >
                                                            {initials}
                                                        </Link>
                                                        <div className="flex flex-col">
                                                            <div className="flex gap-2 items-center">
                                                                <Link
                                                                    href={`/profile/${author_id}`}
                                                                    className="font-medium text-tertiary"
                                                                >
                                                                    {username}
                                                                </Link>
                                                                <span className="text-tertiary-50 text-sm">
                                                                    {commentTime} {`:`}
                                                                </span>
                                                            </div>
                                                            <p className="text-tertiary-50">
                                                                {content}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        {/* Comment input */}
                                        <form className="flex flex-wrap gap-4 items-center mt-4">
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
                                                className="px-4 py-2 text-white bg-primary rounded outline-0 select-none"
                                                onClick={handleAddComment}
                                            >
                                                Comment
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                <div className="flex items-center justify-end mt-4">
                    <button
                        onClick={() => setPage((page) => page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 mr-2 text-white bg-primary rounded outline-0 select-none"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setPage((page) => page + 1)}
                        disabled={posts?.length < pageSize}
                        className="px-4 py-2 text-white bg-primary rounded outline-0 select-none"
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    },
);

PostComponent.displayName = "PostComponent";

export default PostComponent;
