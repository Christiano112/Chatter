"use client";

import { useState } from "react";
import Image from "next/image";
import parse from "html-react-parser";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/slices/user";
import { PostType, selectAllPosts, selectPostFetchStatus } from "@/redux/slices/posts";
import SearchInput from "@/components/search";
import Button from "@/components/button";
import ReactionButton from "@/components/reactions";
import NotificationIcon from "@/public/notification-icon.png";
import AccountIcon from "@/public/account-icon.png";
import PostIcon from "@/public/post-icon.png";
import BookIcon from "@/public/book-icon.png";
import CommentIcon from "@/public/comment-icon.png";
import ProfilePic from "@/public/man.png";
import supaBase from "@/utils/supabase";
import { ErrorToast } from "@/components/toast";
import { formatDateTimeShort } from "@/utils/date";

const Feed = () => {
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [posts, setPosts] = useState<PostType[]>(useAppSelector(selectAllPosts));
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();

    const handleSearch = async (query: string) => {
        let { data: filteredPosts, error } = await supaBase
            .from('posts')
            .select('*')
            .or(`content.ilike.*${query}*, title.ilike.*${query}*`);

        // let { data: posts, error: errorPosts } = await supabase
        //     .from('posts')
        //     .select(`author_id,
        //     users (
        //         first_name,
        //         last_name
        //     )`)

        //     console.log("posts==", posts, "errorPosts==", errorPosts);


        if (error || !filteredPosts || filteredPosts.length === 0) {
            ErrorToast("No posts found");
            return;
        } else {
            setPosts(filteredPosts);
            console.log(filteredPosts);
        }
    };

    return (
        <div className="flex-grow shadow-inner rounded">
            <header className="flex items-center justify-between p-8 m-4 gap-8 border shadow">
                <div className="flex-grow text-center">
                    <SearchInput placeholder="Search..." onSearch={handleSearch} />
                </div>
                <div className="flex items-center gap-4 justify-end">
                    <Image src={NotificationIcon} alt="notification icon" />
                    <Image
                        // src={user ? user?.image : AccountIcon}
                        src={AccountIcon}
                        alt="profile pic"
                        width={30}
                        height={30}
                    />
                    <p>{user && user.username}</p>
                </div>
            </header>

            <main className="shadow-2xl rounded p-8 m-4">
                {showEditor && (
                    <div className="absolute top-5 flex items-center justify-center z-50 mx-auto w-[90%] md:w-[80%]">
                        <div className="bg-white rounded shadow-lg">{/* <TextEditor /> */}</div>
                    </div>
                )}

                <div className="flex items-start sm:items-center justify-between gap-4 sm:gap-8 flex-col sm:flex-row">
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
                    <ul className="flex items-center justify-between gap-8 mt-8 px-4 md:px-8 py-4 rounded-lg mb-2 shadow-inner">
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
                    <div className="rounded-lg shadow-inner px-4 md:px-8 py-4">
                        {!posts || posts.length === 0 ? (
                            <div>No Post Found</div>
                        ) : posts.map((post) => (
                            <div key={post.post_id} className="border-b-2 border-b-slate-700 p-4">
                                <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                                    <Image
                                        src={ProfilePic}
                                        alt="profile pic"
                                        className="rounded-full"
                                    />
                                    <div className="flex flex-col gap-3">
                                        <h4 className="font-medium text-2xl text-tertiary">
                                            Grace Ikpang
                                        </h4>
                                        <p className="text-tertiary-50">
                                            Product Designer,{" "}
                                            <span className="font-medium">{formatDateTimeShort(post.created_at)}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 my-8">
                                    <h3 className="font-semibold text-2xl md:text-4xl text-tertiary">
                                        {post.title}
                                    </h3>
                                    <h6 className="flex gap-2 items-center text-tertiary-50 text-sm">
                                        <span>
                                            <Image src={BookIcon} alt="book icon" />
                                        </span>{" "}
                                        10 mins read
                                    </h6>
                                    <div className="text-tertiary-50">
                                        {parse(post.content)}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap- border-4 px-2 py-4">
                                    <div className="flex items-center gap-2">
                                        <Image src={CommentIcon} alt="comment icon" />
                                        <p className="text-tertiary-50">200</p>
                                    </div>
                                    {<ReactionButton post={post} />}
                                    {/* <div className="flex items-center gap-2">
                                        <Image src={ViewsIcon} alt="views count icon" />
                                        <p className="text-tertiary-50">2980</p>
                                    </div> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Feed;
