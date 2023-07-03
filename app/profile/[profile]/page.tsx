"use client";

import React, { useState } from "react";
import { usePathId, useCheckAuth } from "@/utils/custom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    AiFillMessage,
    AiFillFacebook,
    AiFillTwitterSquare,
    AiFillLinkedin,
    AiFillInstagram,
    AiFillGithub,
    AiFillMediumSquare,
    AiOutlineForm,
} from "react-icons/ai";
import Button from "@/components/button";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import "react-tabs/style/react-tabs.css";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/slices/user";
import {
    useFetchPostsByAuthorId,
    useFetchCommentsForPost,
    usePostInteraction,
    useSearchPosts,
} from "@/hooks/useDBFetch";
import PostComponent from "@/components/post";

const Profile = () => {
    const pathId = usePathId();
    const { user } = useCheckAuth();
    const router = useRouter();
    const { user: pathUser } = useAppSelector<any>(selectUser);
    const [page, setPage] = useState(1);
    const [activeTabIndex, setActiveTabIndex] = useState(2);
    const currentVisitor = user?.id === pathId ? "owner" : "visitor";
    const dispatch = useAppDispatch();
    const author_id = pathUser?.user_id ?? user?.id ?? pathId;
    const { isLoading, posts } = useFetchPostsByAuthorId(page, 3, author_id);
    const { selectedPostComments, fetchCommentsForPost } = useFetchCommentsForPost();
    const { selectedPost, newComment, handleCommentClick, handleAddComment } = usePostInteraction({
        author_id,
        fetchCommentsForPost,
    });
    const { filteredPosts, handleSearch } = useSearchPosts({ author_id });

    const handleTabChange = (index: number) => {
        setActiveTabIndex(index);
    };

    const setNewComment = () => {};

    return (
        <React.Fragment>
            <header
                className="py-[5rem] px-4 sm:px-8 flex flex-col gap-6 bg-slate-950 text-center min-h-[20rem] relative mx-4"
                style={{
                    background: "url('/cover-photo.png') center no-repeat",
                    backgroundSize: "cover",
                }}
            >
                <Image
                    src="/profile-dp.png"
                    alt="Profile Picture"
                    width={200}
                    height={200}
                    className="rounded-full pt-3 bg-primary absolute bottom-[-10%]"
                />
            </header>
            <div className="bg-primary-50 flex justify-between items-center p-8 shadow-inner pl-[15rem] mx-4 rounded-b-lg">
                <div>
                    <h2 className="text-primary text-2xl font-bold">
                        {posts[0]?.author?.first_name} {posts[0]?.author?.last_name}
                    </h2>
                    <p className="text-primary text-base capitalize">{posts[0]?.author?.join_as}</p>
                </div>
                <div className="flex items-center gap-4">
                    {currentVisitor === "owner" ? (
                        <>
                            <Button
                                text="Edit Profile"
                                type="button"
                                size="small"
                                variant="primary"
                                // handleClick={}
                            />
                            <Button
                                text={
                                    <Link
                                        href="/drafts"
                                        className="flex gap-2 items-center justify-center text-white"
                                    >
                                        <AiOutlineForm />
                                        <span>Drafts</span>
                                    </Link>
                                }
                                type="button"
                                size="small"
                                variant="primary"
                            />
                        </>
                    ) : (
                        <>
                            <AiFillMessage
                                className="text-4xl text-primary cursor-pointer"
                                title="Send a message"
                            />
                            <Button
                                text="Follow"
                                type="button"
                                size="small"
                                variant="primary"
                                // handleClick={}
                            />
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-between gap-4 m-4">
                <div className="flex flex-col gap-8 px-4 py-8 rounded-lg bg-primary-50 flex-grow max-h-[40rem]">
                    <h3 className="text-primary text-xl font-bold">Socials</h3>
                    <Link
                        href={"/profile"}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillFacebook className="text-3xl" />
                        <span>Facebook</span>
                    </Link>
                    <Link
                        href={"/profile"}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillInstagram className="text-3xl" />
                        <span>Instagram</span>
                    </Link>
                    <Link
                        href={"/profile"}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillTwitterSquare className="text-3xl" />
                        <span>Twitter</span>
                    </Link>
                    <Link
                        href={"/profile"}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillLinkedin className="text-3xl" />
                        <span>Linkedin</span>
                    </Link>
                    <Link
                        href={"/profile"}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillGithub className="text-3xl" />
                        <span>Github</span>
                    </Link>
                    <Link
                        href={"/profile"}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillMediumSquare className="text-3xl" />
                        <span>Medium</span>
                    </Link>
                </div>
                <div className="bg-primary-50 px-4 pt-8 pb-2 w-[65%] rounded-lg">
                    <Tabs className="" selectedIndex={activeTabIndex} onSelect={handleTabChange}>
                        <TabList className="border-b-4 border-primary flex items-center gap-8 justify-start">
                            <Tab
                                className={`text-xl text-primary p-2 border-none outline-0 cursor-pointer rounded-lg ${
                                    activeTabIndex === 0 ? "font-bold bg-white" : ""
                                }`}
                            >
                                Followers
                            </Tab>
                            <Tab
                                className={`text-xl text-primary p-2 border-none outline-0 cursor-pointer rounded-lg ${
                                    activeTabIndex === 1 ? "font-bold bg-white" : ""
                                }`}
                            >
                                Following
                            </Tab>
                            <Tab
                                className={`text-xl text-primary p-2 border-none outline-0 cursor-pointer rounded-lg ${
                                    activeTabIndex === 2 ? "font-bold bg-white" : ""
                                }`}
                            >
                                Posts
                            </Tab>
                        </TabList>

                        <TabPanel>
                            <h2>Followers Posts</h2>
                        </TabPanel>
                        <TabPanel>
                            <h2>Following Posts</h2>
                        </TabPanel>
                        <TabPanel>
                            <PostComponent
                                isLoading={isLoading}
                                posts={posts}
                                handleCommentClick={handleCommentClick}
                                selectedPost={selectedPost}
                                selectedPostComments={selectedPostComments}
                                newComment={newComment}
                                handleAddComment={handleAddComment}
                                setPage={setPage}
                                page={page}
                                setNewComment={setNewComment}
                            />
                        </TabPanel>
                    </Tabs>
                </div>
                <div className="flex flex-col gap-8 px-4 py-8 rounded-lg bg-primary-50 flex-grow max-h-[40rem]">
                    <h3 className="text-primary text-xl font-medium">You might know</h3>
                    <Link
                        href={"/profile"}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillFacebook className="text-3xl" />
                        <span>Lobanovskiy</span>
                    </Link>
                    <Link
                        href={"/profile"}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillInstagram className="text-3xl" />
                        <span>Eddie</span>
                    </Link>
                    <Link
                        href={"/profile"}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillTwitterSquare className="text-3xl" />
                        <span>Tkacheve</span>
                    </Link>
                    <Link
                        href={"/profile"}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillLinkedin className="text-3xl" />
                        <span>Anton</span>
                    </Link>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Profile;
