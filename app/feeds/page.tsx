"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import { useUser } from "@supabase/auth-helpers-react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/slices/user";
import { PostType, selectAllPosts } from "@/redux/slices/posts";
import { addComment } from "@/redux/slices/comments";
import SearchInput from "@/components/search";
import Button from "@/components/button";
import ReactionButton from "@/components/reactions";
import NotFound from "@/components/not-found";
import Loading from "@/app/loading";
import NotificationIcon from "@/public/notification-icon.png";
import AccountIcon from "@/public/account-icon.png";
import PostIcon from "@/public/post-icon.png";
import BookIcon from "@/public/book-icon.png";
import CommentIcon from "@/public/comment-icon.png";
import ProfilePic from "@/public/man.png";
import supaBase from "@/utils/supabase";
import { ErrorToast } from "@/components/toast";
import { formatDateTimeShort } from "@/utils/date";
import calculateReadingTime from "@/utils/reading_time";
import { formatName } from "@/utils/format";

const Feed = () => {
    const authUser = useUser();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [posts, setPosts] = useState<PostType[] | any[]>(useAppSelector(selectAllPosts));
    const [selectedPostComments, setSelectedPostComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
    const [author_id, setAuthorId] = useState(user.user_id);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const excerptLimit = 500;

    // useEffect(() => {
    //     if (authUser?.id || user.user_id) {
    //         setAuthorId(authUser?.id ?? user.user_id);
    //     } else {
    //         ErrorToast("No user found, can't make post");
    //     }
    // }, [authUser, user]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                let { data: posts, error } = await supaBase
                    .from("posts")
                    .select(
                        `*,
                    author:users(first_name, last_name, username, join_as, user_id),
                    comments:comments(id)`,
                    )
                    .range((page - 1) * pageSize, page * pageSize - 1)
                    .order("created_at", { ascending: false });

                if (error || !posts) {
                    ErrorToast(error?.message ?? "Error fetching updated posts");
                    return;
                }

                setPosts(posts);
            } catch (error: any) {
                ErrorToast(error?.message ?? "Error fetching updated post");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [page]);

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

    const handleCommentClick = async (post: PostType) => {
        setNewComment("");
        setSelectedPostComments([]);
        setSelectedPost(post);
        await fetchCommentsForPost(post.post_id);
    };

    const handleAddComment = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!newComment.trim() || !selectedPost) {
            ErrorToast("Comment cannot be empty");
            return;
        }

        const { data: comment, error } = await supaBase
            .from("comments")
            .insert([
                {
                    author_id: author_id,
                    comment_id: selectedPost.post_id,
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

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            return;
        }

        let { data: filteredPosts, error } = await supaBase
            .from("posts")
            .select(
                `*,
                        author:users(first_name, last_name, username, join_as, user_id)
                    `,
            )
            .or(`content.ilike.*${query}*, title.ilike.*${query}*`)
            .order("created_at", { ascending: false });

        if (error || !filteredPosts || filteredPosts.length === 0) {
            ErrorToast(error?.message ?? "No posts found");
            return;
        } else {
            setPosts(filteredPosts);
        }
    };

    return (
        <div className="flex-grow shadow-inner rounded">
            <header className="flex items-center justify-between px-2 md:px-4 py-4 md:py-8 m-4 gap-4 md:gap-8 border shadow">
                <div className="flex-grow text-center min-w-[10rem]">
                    <SearchInput placeholder="Search..." onSearch={handleSearch} />
                </div>
                <div className="flex items-center gap-2 md:gap-4 justify-end">
                    <Image src={NotificationIcon} alt="notification icon" />
                    <Image
                        // src={user ? user?.image : AccountIcon}
                        src={AccountIcon}
                        alt="profile pic"
                        width={30}
                        height={30}
                    />
                    <Link href={`/profile/${user.user_id}`} className="cursor-pointer">
                        {user && user.username}
                    </Link>
                </div>
            </header>

            <main className="shadow-2xl rounded p-4 md:p-8 m-2 sm:m-4">
                {showEditor && (
                    <div className="absolute top-5 flex items-center justify-center z-50 mx-auto w-[90%] md:w-[80%]">
                        <div className="bg-white rounded shadow-lg">{/* <TextEditor /> */}</div>
                    </div>
                )}

                <div className="flex items-start sm:items-center justify-between gap-2 md:gap-4 sm:gap-8 flex-col sm:flex-row">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-semibold text-2xl md:text-4xl">Feed</h1>
                        <p className="text-tertiary-50">Explore different content you’d love</p>
                    </div>
                    <Button
                        text={
                            <div className="flex gap-2 items-center">
                                <span>
                                    <Image src={PostIcon} alt="post icon" />
                                </span>{" "}
                                Post a content
                            </div>
                        }
                        type="button"
                        variant="primary"
                        size="medium"
                        handleClick={() => setShowEditor(true)}
                    />
                </div>

                <section>
                    <ul className="flex items-center justify-between gap-8 mt-8 px-2 sm:px-4 md:px-8 py-4 rounded-lg mb-2 shadow-inner">
                        <li className="text-tertiary font-medium text-xl border-b-8 border-primary hover:cursor-pointer">
                            For you
                        </li>
                        <li className="text-tertiary font-medium text-xl hover:cursor-pointer">
                            Featured
                        </li>
                        <li className="text-tertiary font-medium text-xl hover:cursor-pointer">
                            Recent
                        </li>
                    </ul>
                    <div className="rounded-lg shadow-inner px-2 sm:px-4 md:px-8 py-4">
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
                                                    {post?.author?.first_name}{" "}
                                                    {post?.author?.last_name}
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
                                                {/* {parse(post?.content ?? "")} */}
                                                {parse(excerpt)}
                                                {contentLength > excerptLimit && (
                                                    <Link
                                                        href={`/feeds/${post?.post_id}`}
                                                        className="underline text-primary cursor-pointer"
                                                        target="_blank"
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
                                                                            {
                                                                                comment.author
                                                                                    ?.username
                                                                            }{" "}
                                                                            {`:`}
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
                                                            onChange={(e) =>
                                                                setNewComment(e.target.value)
                                                            }
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
                    </div>
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
                            className="px-4 py-2 text-white bg-primary rounded outline-0 select-none"
                        >
                            Next
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Feed;
