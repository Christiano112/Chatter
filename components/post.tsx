import React from "react";
import Loading from "@/app/loading";
import NotFound from "./not-found";
import calculateReadingTime from "@/utils/reading_time";
import { formatDateTimeShort } from "@/utils/date";
import { formatName } from "@/utils/format";
import parse from "html-react-parser";
import Link from "next/link";
import Image from "next/image";
import ReactionButton from "./reactions";
import BookIcon from "@/public/book-icon.png";
import CommentIcon from "@/public/comment-icon.png";
import ProfilePic from "@/public/man.png";

interface PostComponentProps {
    isLoading: boolean;
    posts: any[];
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

const PostComponent = ({
    isLoading,
    posts,
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
    return (
        <div className="rounded-lg shadow-inner px-2 sm:px-4 py-4">
            {isLoading ? (
                <Loading />
            ) : !posts || posts.length === 0 ? (
                <NotFound text="No more posts" />
            ) : (
                posts.map((post) => {
                    const readingTime = calculateReadingTime(post?.content) + " mins";
                    const commentsCount = Object.keys(post?.comments ?? {}).length;
                    const contentLength = post?.content.length || 0;
                    const excerpt = post?.content.slice(0, excerptLimit);
                    return (
                        <div
                            key={post?.post_id}
                            className="border-b-2 border-b-slate-700 p-2 sm:p-4"
                        >
                            <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                                <Link href={`/profile/${post?.author?.user_id}`}>
                                    <Image
                                        src={ProfilePic}
                                        alt="profile pic"
                                        className="rounded-full cursor-pointer"
                                    />
                                </Link>
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href={`/profile/${post?.author?.user_id}`}
                                        className="font-medium text-2xl text-tertiary cursor-pointer"
                                    >
                                        {post?.author?.first_name} {post?.author?.last_name}
                                    </Link>
                                    <p className="text-tertiary-50 capitalize">
                                        {post?.author?.join_as},{" "}
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
                                    {parse(excerpt)}
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
                    );
                })
            )}
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
                    disabled={posts?.length <= pageSize}
                    className="px-4 py-2 text-white bg-primary rounded outline-0 select-none"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PostComponent;
