"use client";

import Button from "@/components/button";
import PostComponent from "@/components/post";
import {
    isEmptyObject,
    useFetchCommentsForPost,
    useFetchPostsByAuthorId,
    usePostInteraction,
    useReactionUpdate,
    useProfile,
} from "@/hooks/useDBFetch";
import { shallowEqual } from "react-redux";
import { selectUser } from "@/redux/slices/user";
import { useAppSelector } from "@/redux/store";
import { PostType, selectPostsByAuthorId } from "@/redux/slices/posts";
import { useCheckAuth, usePathId } from "@/utils/custom";
import { useSocialLinkForm, useUpdateUserForm } from "@/utils/form";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useMemo, memo } from "react";
import {
    AiFillFacebook,
    AiFillGithub,
    AiFillInstagram,
    AiFillLinkedin,
    AiFillMediumSquare,
    AiFillMessage,
    AiFillTwitterSquare,
    AiFillYoutube,
    AiOutlineForm,
    AiOutlineLink,
} from "react-icons/ai";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import EditImagesPopup from "../editImage";
import EditProfilePopup from "../editProfile";
import Loading from "@/app/loading";

const pageSize = 10;

const Profile = () => {
    const pathId = usePathId();
    const { user: authUser, authenticated } = useCheckAuth();
    const [authLoading, setAuthLoading] = useState(true);
    const [user, setUser] = useState<any>(useAppSelector(selectUser));
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
    const { isLoading, posts: fetchedPosts } = useFetchPostsByAuthorId(page, pageSize, pathId);
    const { selectedPostComments, fetchCommentsForPost, setSelectedPostComments } =
        useFetchCommentsForPost();
    const { selectedPost, newComment, handleCommentClick, handleAddComment, setNewComment } =
        usePostInteraction({
            pathId,
            fetchCommentsForPost,
            setSelectedPostComments,
        });
    const { handleReactionUpdate } = useReactionUpdate(posts, setPosts);
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
    const [profilePic, setProfile] = useState(
        typeof profilePicEdit === "string" ? profilePicEdit : "/profile-dp.png",
    );
    const [coverPic, setCover] = useState(
        typeof coverPicEdit === "string" ? coverPicEdit : "/cover-photo.png",
    );

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

    useEffect(() => {
        const checkUser = async () => {
            try {
                setAuthLoading(true);
                if (!user || !user?.email) {
                    setUser(authUser);
                }
            } catch (error: any) {
                throw new Error(error.message);
            } finally {
                setAuthLoading(false);
            }
        };

        if (authenticated) {
            checkUser();
        }
    }, [authUser, authenticated, user]);

    useEffect(() => {
        if (fetchedPosts.length > 0) {
            setPosts(fetchedPosts);
            return;
        }
    }, [fetchedPosts]);

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

    console.log("userp", user, "authuserp", authUser);

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
                        src={profilePic}
                        alt="Profile Picture"
                        width={200}
                        height={200}
                        className="rounded-full bg-primary absolute bottom-[-10%]"
                    />
                    {currentVisitor === "owner" && (
                        <Button
                            text="Edit Pictures"
                            type="button"
                            size="small"
                            style={{
                                backgroundColor: "white",
                                color: "#543EE0",
                                position: "absolute",
                                top: "0",
                                right: "2%",
                            }}
                            handleClick={() => setShowEditImagePopup(true)}
                            disabled={!authenticated || !user?.email}
                        />
                    )}
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
                        {!posts && isEmptyObject(posts[0]) && authUser
                            ? authUser?.user_metadata?.full_name || authUser?.user_metadata?.name
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
                                text="Edit Profile"
                                type="button"
                                size="small"
                                variant="primary"
                                handleClick={() => setShowPopup(true)}
                                disabled={!authenticated || !user?.email}
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
                {!isEmptyObject(socials) && (
                    <div className="flex flex-row flex-wrap sm:flex-col gap-4 sm:gap-8 px-4 py-8 rounded-lg bg-primary-50 flex-grow max-h-[40rem]">
                        <h3 className="text-primary text-xl font-bold">Socials:</h3>
                        {socials?.facebook_link && (
                            <Link
                                href={socials.facebook_link}
                                rel="noreferrer"
                                target="_blank"
                                className="text-primary cursor-pointer flex items-center gap-2"
                            >
                                <AiFillFacebook className="text-3xl" />
                                <span>Facebook</span>
                            </Link>
                        )}
                        {socials?.twitter_link && (
                            <Link
                                href={socials.twitter_link}
                                rel="noreferrer"
                                target="_blank"
                                className="text-primary cursor-pointer flex items-center gap-2"
                            >
                                <AiFillTwitterSquare className="text-3xl" />
                                <span>Twitter</span>
                            </Link>
                        )}
                        {socials?.instagram_link && (
                            <Link
                                href={socials.instagram_link}
                                rel="noreferrer"
                                target="_blank"
                                className="text-primary cursor-pointer flex items-center gap-2"
                            >
                                <AiFillInstagram className="text-3xl" />
                                <span>Instagram</span>
                            </Link>
                        )}
                        {socials?.linkedin_link && (
                            <Link
                                href={socials.linkedin_link}
                                rel="noreferrer"
                                target="_blank"
                                className="text-primary cursor-pointer flex items-center gap-2"
                            >
                                <AiFillLinkedin className="text-3xl" />
                                <span>LinkedIn</span>
                            </Link>
                        )}
                        {socials?.github_link && (
                            <Link
                                href={socials.github_link}
                                rel="noreferrer"
                                target="_blank"
                                className="text-primary cursor-pointer flex items-center gap-2"
                            >
                                <AiFillGithub className="text-3xl" />
                                <span>Github</span>
                            </Link>
                        )}
                        {socials?.medium_link && (
                            <Link
                                href={socials.medium_link}
                                rel="noreferrer"
                                target="_blank"
                                className="text-primary cursor-pointer flex items-center gap-2"
                            >
                                <AiFillMediumSquare className="text-3xl" />
                                <span>Medium</span>
                            </Link>
                        )}
                        {socials?.youtube_link && (
                            <Link
                                href={socials.youtube_link}
                                rel="noreferrer"
                                target="_blank"
                                className="text-primary cursor-pointer flex items-center gap-2"
                            >
                                <AiFillYoutube className="text-3xl" />
                                <span>Youtube</span>
                            </Link>
                        )}
                        {socials?.website_link && (
                            <Link
                                href={socials.website_link}
                                rel="noreferrer"
                                target="_blank"
                                className="text-primary cursor-pointer flex items-center gap-2"
                            >
                                <AiOutlineLink className="text-3xl" />
                                <span>Website</span>
                            </Link>
                        )}
                    </div>
                )}
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
