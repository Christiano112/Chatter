"use client";

import { useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Button from "@/components/button";
import PostComponent from "@/components/post";
import SearchInput from "@/components/search";
import {
    useFetchAllPosts,
    useFetchCommentsForPost,
    usePostInteraction,
    useSearchPosts,
    useReactionUpdate,
} from "@/hooks/useDBFetch";
import AccountIcon from "@/public/account-icon.png";
import NotificationIcon from "@/public/notification-icon.png";
import PostIcon from "@/public/post-icon.png";
import { PostType, fetchPostsToStore, selectAllPosts } from "@/redux/slices/posts";
import { fetchUserFromDB, selectUser } from "@/redux/slices/user";
import { useAppSelector, useAppDispatch } from "@/redux/store";

const pageSize = 20;

const Feeds = () => {
    const authUser = useUser();
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const [posts, setPosts] = useState<PostType[] | any[]>(useAppSelector(selectAllPosts));
    const [author_id, setAuthorId] = useState(user?.user_id);
    const [page, setPage] = useState(1);
    const { isLoading, posts: fetchedPosts } = useFetchAllPosts(page, pageSize);
    const { selectedPostComments, fetchCommentsForPost, setSelectedPostComments } =
        useFetchCommentsForPost();
    const { selectedPost, newComment, handleCommentClick, handleAddComment, setNewComment } =
        usePostInteraction({
            author_id,
            fetchCommentsForPost,
            setSelectedPostComments,
        });
    const { filteredPosts, handleSearch } = useSearchPosts();
    const { handleReactionUpdate } = useReactionUpdate(posts, setPosts);

    useEffect(() => {
        if (authUser?.id || user?.user_id) {
            setAuthorId(authUser?.id ?? user?.user_id);
        }
        if (!authUser?.email) return;
        dispatch(fetchPostsToStore());
        dispatch(fetchUserFromDB(authUser?.email));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (filteredPosts && filteredPosts?.length > 0) {
            setPosts(filteredPosts);
            return;
        }

        if (fetchedPosts && fetchedPosts?.length > 0) {
            setPosts(fetchedPosts);
            return;
        }
    }, [filteredPosts, fetchedPosts]);

    return (
        <div className="flex-grow shadow-inner rounded">
            <header className="flex items-center justify-between px-2 md:px-4 py-4 md:py-8 m-4 gap-4 md:gap-8 border shadow">
                <div className="flex-grow text-center min-w-[10rem]">
                    <SearchInput placeholder="Search..." onSearch={handleSearch} />
                </div>
                <div className="flex items-center gap-2 md:gap-4 justify-end">
                    <Image src={NotificationIcon} alt="notification icon" />
                    <Image
                        src={
                            authUser
                                ? authUser?.user_metadata?.avatar_url ||
                                  authUser?.user_metadata?.picture
                                : AccountIcon
                        }
                        alt="profile pic"
                        width={30}
                        height={30}
                        className="rounded-full mr-[-.5rem]"
                    />
                    <Link
                        href={`/profile/${user?.user_id || authUser?.id}`}
                        className="cursor-pointer"
                    >
                        {user && user?.username
                            ? user?.username
                            : authUser && authUser?.user_metadata
                            ? authUser?.user_metadata?.full_name || authUser?.user_metadata?.name
                            : ""}
                    </Link>
                </div>
            </header>

            <main className="shadow-2xl rounded p-4 md:p-8 m-2 sm:m-4">
                <div className="flex items-start sm:items-center justify-between gap-2 md:gap-4 sm:gap-8 flex-col sm:flex-row">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-semibold text-2xl md:text-4xl">Feed</h1>
                        <p className="text-tertiary-50">Explore different content you’d love</p>
                    </div>
                    <Button
                        text={
                            <Link href="/editor" className="flex gap-2 items-center">
                                <span>
                                    <Image src={PostIcon} alt="post icon" />
                                </span>{" "}
                                Post a content
                            </Link>
                        }
                        type="button"
                        variant="primary"
                        size="medium"
                    />
                </div>

                <section>
                    <ul className="flex items-center justify-between gap-8 mt-8 px-2 sm:px-4 md:px-8 py-4 rounded-lg mb-2 shadow-inner">
                        <li className="text-tertiary font-medium text-xl border-b-4 border-primary hover:cursor-pointer">
                            For you
                        </li>
                        {/* <li className="text-tertiary font-medium text-xl hover:cursor-pointer">
                            Featured
                        </li>
                        <li className="text-tertiary font-medium text-xl hover:cursor-pointer">
                            Recent
                        </li> */}
                    </ul>
                    <PostComponent
                        isLoading={isLoading}
                        posts={posts}
                        handleReactionUpdate={handleReactionUpdate}
                        handleCommentClick={handleCommentClick}
                        selectedPost={selectedPost}
                        selectedPostComments={selectedPostComments}
                        newComment={newComment}
                        handleAddComment={handleAddComment}
                        setPage={setPage}
                        page={page}
                        pageSize={pageSize}
                        setNewComment={setNewComment}
                    />
                </section>
            </main>
        </div>
    );
};

export default Feeds;
