"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiFillMessage, AiOutlineForm, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { MdArticle } from "react-icons/md";
import { shallowEqual } from "react-redux";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Loading from "@/app/loading";
import Button from "@/components/button";
import PostComponent from "@/components/post";
import SignOutBtn from "@/components/signOutBtn";
import {
    isEmptyObject,
    useFetchCommentsForPost,
    useFetchPostsByAuthorId,
    usePostInteraction,
    useReactionUpdate,
    useProfile,
} from "@/hooks/useDBFetch";
import { PostType, selectPostsByAuthorId } from "@/redux/slices/posts";
import { selectUser } from "@/redux/slices/user";
import { useAppSelector } from "@/redux/store";
import { useCheckAuth, usePathId } from "@/utils/custom";
import { useSocialLinkForm, useUpdateUserForm } from "@/utils/form";
import EditImagesPopup from "../editImage";
import EditProfilePopup from "../editProfile";
import SocialMediaLinks from "../socialLinks";

const pageSize = 10;

const Profile = () => {
    const pathId = usePathId();
    const [user, setUser] = useState<any>(useAppSelector(selectUser));
    const { user: authUser, authenticated } = useCheckAuth();
    const [authLoading, setAuthLoading] = useState(false);
    const currentVisitor =
        user?.user_id === pathId
            ? "owner"
            : authUser?.id && authUser?.id === pathId
            ? "owner"
            : "visitor";
    const [page, setPage] = useState(1);
    const [activeTabIndex, setActiveTabIndex] = useState(1);
    const [activeEditTab, setActiveEditTab] = useState(1);
    const [posts, setPosts] = useState<PostType[] | any[]>(
        useAppSelector((state) => selectPostsByAuthorId(state, pathId), shallowEqual),
    );
    const {
        pageLoading,
        socials,
        showPopup,
        onEditSubmit,
        setShowPopup,
        handleSocialFormSubmit,
        profilePicEdit,
        coverPicEdit,
        showEditImagePopup,
        setShowEditImagePopup,
        handleProfilePicChange,
        handleCoverPicChange,
        handlePictureUpload,
    } = useProfile(pathId, user);
    const { isLoading, posts: fetchedPosts } = useFetchPostsByAuthorId(page, pageSize, pathId);
    const { selectedPostComments, fetchCommentsForPost, setSelectedPostComments } =
        useFetchCommentsForPost();
    const { selectedPost, newComment, handleCommentClick, handleAddComment, setNewComment } =
        usePostInteraction({
            author_id: user?.user_id || (authUser && authUser.id),
            fetchCommentsForPost,
            setSelectedPostComments,
        });
    const { handleReactionUpdate } = useReactionUpdate(posts, setPosts);
    const [profilePic, setProfile] = useState(
        typeof profilePicEdit === "string"
            ? profilePicEdit
            : currentVisitor === "owner" && authUser?.user_metadata
            ? authUser?.user_metadata?.avatar_url
            : "/profile-dp.png",
    );
    const [coverPic, setCover] = useState(
        typeof coverPicEdit === "string" ? coverPicEdit : "/cover-photo.png",
    );
    const [showEditProfile, setShowEditProfile] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            try {
                setAuthLoading(true);
                if (currentVisitor !== "owner") return;
                if (!user || !user?.email) {
                    setUser(authUser);
                }
            } catch (error: any) {
                throw new Error(error.message);
            } finally {
                setAuthLoading(false);
            }
        };

        if (authenticated && currentVisitor === "owner") {
            checkUser();
        }
    }, [authUser, authenticated, currentVisitor, user]);

    useEffect(() => {
        if (fetchedPosts.length > 0) {
            setPosts(fetchedPosts);
        }
    }, [fetchedPosts]);

    // change profile pic if updated
    useEffect(() => {
        if (typeof profilePicEdit === "string") {
            setProfile(profilePicEdit);
        }
    }, [profilePicEdit]);

    // change cover pic if updated
    useEffect(() => {
        if (typeof coverPicEdit === "string") {
            setCover(coverPicEdit);
        }
    }, [coverPicEdit]);

    const handleTabChange = (index: number) => {
        setActiveTabIndex(index);
    };

    const { register, handleFormSubmit, errors } = useUpdateUserForm(onEditSubmit);
    const {
        register: socialFormRegister,
        handleFormSubmit: socialFormSubmit,
        errors: socialFormErrors,
    } = useSocialLinkForm(handleSocialFormSubmit);

    if (authLoading || pageLoading) {
        return <Loading />;
    }

    return (
        <React.Fragment>
            {!pageLoading && (
                <header
                    className="py-[5rem] px-4 sm:px-8 flex flex-col gap-6 bg-slate-950 text-center min-h-[20rem] relative mt-2 mx-2 rounded-t-lg"
                    style={{
                        backgroundImage: `url('${coverPic}')`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                    }}
                >
                    <Image
                        src={profilePic ?? "/profile-dp.png"}
                        alt="Profile Picture"
                        width={200}
                        height={200}
                        className="rounded-full bg-primary absolute bottom-[-10%]"
                    />
                    {showEditProfile && (
                        <div className="absolute top-2 right-2 rounded p-2 bg-white shadow-inner z-50">
                            <AiOutlineClose
                                className="text-2xl text-red-700 cursor-pointer absolute right-2"
                                onClick={() => setShowEditProfile(false)}
                            />
                            {currentVisitor === "owner" && (
                                <div className="flex flex-col gap-0 mt-8">
                                    <Button
                                        text="Edit Profile"
                                        type="button"
                                        size="small"
                                        variant="primary"
                                        handleClick={() => {
                                            setShowPopup(true);
                                            setShowEditProfile(false);
                                        }}
                                        disabled={!authenticated || !user?.email}
                                    />
                                    <Button
                                        text="Edit Pictures"
                                        type="button"
                                        size="small"
                                        variant="primary"
                                        style={{
                                            marginTop: "-.3rem",
                                        }}
                                        handleClick={() => {
                                            setShowEditImagePopup(true);
                                            setShowEditProfile(false);
                                        }}
                                        disabled={!authenticated || !user?.email}
                                    />
                                </div>
                            )}
                            <div className="mt-[-1rem]">
                                <SignOutBtn />
                            </div>
                        </div>
                    )}
                    <AiOutlineMenu
                        className="absolute right-2 top-2 text-bold text-white text-4xl cursor-pointer"
                        onClick={() => setShowEditProfile(true)}
                    />
                </header>
            )}
            <div className="bg-primary-50 flex flex-col 2xs:flex-row justify-between items-center px-4 pb-4 pt-10 shadow-inner md:pl-[15rem] mx-2 rounded-b-lg">
                <div>
                    <h2 className="text-primary text-2xl font-bold">
                        {posts && posts?.length > 0 && !isEmptyObject(posts[0])
                            ? posts[0]?.author?.first_name ?? user?.first_name
                            : ""}{" "}
                        {posts && posts?.length > 0 && !isEmptyObject(posts[0])
                            ? posts[0]?.author?.last_name ?? user?.last_name
                            : ""}
                    </h2>
                    <p className="text-primary text-base capitalize">
                        {posts && posts?.length > 0 && !isEmptyObject(posts[0])
                            ? posts[0]?.author?.join_as ?? user?.join_as
                            : ""}
                    </p>
                </div>
                <div className="flex items-center gap-0 xs:gap-4 flex-col xs:flex-row">
                    {currentVisitor === "owner" ? (
                        <>
                            <Button
                                text={
                                    <Link
                                        href="/feeds"
                                        className="flex gap-2 items-center justify-center text-white"
                                    >
                                        <MdArticle />
                                        <span>Feeds</span>
                                    </Link>
                                }
                                type="button"
                                size="small"
                                variant="primary"
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
                            <Button text="Follow" type="button" size="small" variant="primary" />
                        </>
                    )}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-2 m-2">
                {!isEmptyObject(socials) && <SocialMediaLinks socials={socials} />}
                <div className="bg-primary-50 px-4 pt-8 pb-2 flex-grow w-[100%] sm:w-[85%] min-h-[20rem] rounded-lg">
                    <Tabs className="" selectedIndex={activeTabIndex} onSelect={handleTabChange}>
                        <TabList className="border-b-4 border-primary flex items-center gap-8 justify-start">
                            <Tab
                                className={`tab ${
                                    activeTabIndex === 0 ? "font-bold bg-white" : ""
                                }`}
                            >
                                Friends
                            </Tab>
                            <Tab
                                className={`tab ${
                                    activeTabIndex === 1 ? "font-bold bg-white" : ""
                                }`}
                            >
                                Posts
                            </Tab>
                        </TabList>
                        <TabPanel>
                            <h2>Friend Posts</h2>
                        </TabPanel>
                        <TabPanel>
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
                                authUser={authUser}
                                currentVisitor={currentVisitor}
                                profilePic={profilePic}
                            />
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
            {showPopup && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75">
                    <div className="bg-white rounded-lg shadow-lg px-4 sm:px-8 pt-4 sm:pt-8 pb-0 m-4 w-full 2xs:max-w-[80%]">
                        <Button
                            text="Cancel Editing"
                            type="button"
                            size="medium"
                            style={{ fontWeight: "800", backgroundColor: "red" }}
                            handleClick={() => setShowPopup(false)}
                        />
                        <div className="py-4">
                            <EditProfilePopup
                                activeEditTab={activeEditTab}
                                handleFormSubmit={handleFormSubmit}
                                socialFormSubmit={socialFormSubmit}
                                setActiveEditTab={setActiveEditTab}
                                register={register}
                                errors={errors}
                                socialFormRegister={socialFormRegister}
                                socialFormErrors={socialFormErrors}
                            />
                        </div>
                    </div>
                </div>
            )}
            {showEditImagePopup && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75">
                    <div className="bg-white rounded-lg shadow-lg px-4 sm:px-8 pt-4 sm:pt-8 pb-0 m-4 w-full 2xs:max-w-[80%]">
                        <Button
                            text="Cancel Editing"
                            type="button"
                            size="medium"
                            style={{ fontWeight: "800", backgroundColor: "red" }}
                            handleClick={() => setShowEditImagePopup(false)}
                        />
                        <EditImagesPopup
                            handlePictureUpload={handlePictureUpload}
                            handleProfilePicChange={handleProfilePicChange}
                            handleCoverPicChange={handleCoverPicChange}
                        />
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default Profile;
