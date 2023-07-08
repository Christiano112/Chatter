"use client";

import Button from "@/components/button";
import PostComponent from "@/components/post";
import { ErrorToast, SuccessToast } from "@/components/toast";
import {
    downloadAndSetImage,
    uploadImageToStore,
    useFetchCommentsForPost,
    useFetchPostsByAuthorId,
    usePostInteraction,
    useReactionUpdate,
} from "@/hooks/useDBFetch";
import { selectUser, updateUser } from "@/redux/slices/user";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { PostType, selectPostsByAuthorId } from "@/redux/slices/posts";
import { useCheckAuth, usePathId } from "@/utils/custom";
import { SocialLinkType, UpdateUserType, useSocialLinkForm, useUpdateUserForm } from "@/utils/form";
import supaBase from "@/utils/supabase";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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

const mapUpdateDataToColumns = (updateData: UpdateUserType) => {
    const { first_name, last_name, username, join_as, email } = updateData;

    return {
        first_name,
        last_name,
        username,
        join_as,
        email,
    };
};

const isEmptyObject = (obj: any) => {
    return Object.keys(obj).length === 0;
};

const pageSize = 10;

const Profile = () => {
    const pathId = usePathId();
    const { user } = useCheckAuth();
    const currentVisitor = user?.id === pathId ? "owner" : "visitor";
    const { user: pathUser } = useAppSelector<any>(selectUser);
    const dispatch = useAppDispatch();
    const [showPopup, setShowPopup] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [showEditImagePopup, setShowEditImagePopup] = useState(false);
    const [profilePicEdit, setProfilePicEdit] = useState<File | null>(null);
    const [coverPicEdit, setCoverPicEdit] = useState<File | null>(null);
    const [page, setPage] = useState(1);
    const [activeTabIndex, setActiveTabIndex] = useState(2);
    const [activeEditTab, setActiveEditTab] = useState(1);
    const [socials, setSocials] = useState<any>({});
    const [posts, setPosts] = useState<PostType[] | any[]>(
        useAppSelector((state) => selectPostsByAuthorId(state, pathId)),
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

    useEffect(() => {
        if (fetchedPosts.length > 0) {
            setPosts(fetchedPosts);
            return;
        }
    }, [fetchedPosts]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setPageLoading(true);
                const { data: currentEmail, error: emailError } = await supaBase
                    .from("users")
                    .select("email")
                    .eq("user_id", pathId);

                if (emailError) {
                    throw new Error(emailError.message);
                }

                const { data, error } = await supaBase
                    .from("profile")
                    .select("*")
                    .eq("email", currentEmail[0].email);

                if (data?.length === 0) return;

                if (error) {
                    throw new Error(error.message);
                }

                // If socials exist, set the socials state
                if (!isEmptyObject(data)) {
                    setSocials(data[0].socials);
                }

                // Download profile and cover pics
                await Promise.all([
                    downloadAndSetImage(data, "profile_pic", setProfilePicEdit),
                    downloadAndSetImage(data, "cover_pic", setCoverPicEdit),
                ]);
            } catch (error: any) {
                // if (error.message.includes("pic")) return;
                ErrorToast(error.message);
            } finally {
                setPageLoading(false);
            }
        };

        fetchProfile();
    }, [pathId]);

    const onEditSubmit = async (data: UpdateUserType) => {
        const mappedData: {
            email?: string;
            first_name?: string;
            join_as?: string;
            last_name?: string;
            username?: string;
            [key: string]: string | undefined;
        } = mapUpdateDataToColumns(data);

        // Remove empty fields from mappedData
        for (const key in mappedData) {
            if (mappedData.hasOwnProperty(key) && !mappedData[key]) {
                delete mappedData[key];
            }
        }

        const { data: dbData, error } = await supaBase
            .from("users")
            .update(mappedData)
            .eq("email", mappedData.email)
            .select();

        if (error) {
            ErrorToast(error.message);
            return;
        }

        dispatch(updateUser(mappedData));
        SuccessToast("Profile updated successfully");
        setShowPopup(false);
    };

    const handleSocialFormSubmit = async (socialData: SocialLinkType) => {
        try {
            // Remove empty fields from socialData
            const filteredSocialData = Object.entries(socialData).reduce(
                (acc: SocialLinkType, [key, value]) => {
                    if (value !== "") {
                        acc[key] = value;
                    }
                    return acc;
                },
                {},
            );

            if (!isEmptyObject(socials)) {
                // If socials exist, update the specific fields
                const updatedSocials = { ...socials, ...filteredSocialData };

                const { data, error } = await supaBase
                    .from("profile")
                    .update({ socials: updatedSocials })
                    .eq("email", user?.email)
                    .select();

                if (error) {
                    ErrorToast(error.message);
                    return;
                }
            } else {
                // If socials do not exist, insert a new record
                if (!user?.email) {
                    ErrorToast("An error occurred. Please try again later.");
                    return;
                }
                const { data, error } = await supaBase
                    .from("profile")
                    .insert([{ socials: filteredSocialData, email: user?.email }])
                    .eq("email", user?.email)
                    .select();

                if (error) {
                    ErrorToast(error.message);
                    return;
                }
            }

            SuccessToast("Social links updated successfully");
        } catch (error) {
            ErrorToast("An error occurred. Please try again later.");
        } finally {
            setShowPopup(false);
        }
    };

    const handleTabChange = (index: number) => {
        setActiveTabIndex(index);
    };

    const { register, handleFormSubmit, errors } = useUpdateUserForm(onEditSubmit);
    const {
        register: socialFormRegister,
        handleFormSubmit: socialFormSubmit,
        errors: socialFormErrors,
    } = useSocialLinkForm(handleSocialFormSubmit);

    // For images upload
    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfilePicEdit(e.target.files[0]);
        }
    };

    const handleCoverPicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCoverPicEdit(e.target.files[0]);
        }
    };

    const handlePictureUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (profilePicEdit) {
            const profilePicName = `profile_${Date.now()}_${profilePicEdit.name}`;
            const profilePicUrl = await uploadImageToStore(profilePicEdit, profilePicName);

            const { data, error } = await supaBase
                .from("profile")
                .update({ profile_pic: profilePicUrl })
                .eq("email", user?.email);

            if (error) {
                ErrorToast(error.message);
                return;
            }
        }

        if (coverPicEdit) {
            const coverPicName = `cover_${Date.now()}_${coverPicEdit.name}`;
            const coverPicUrl = await uploadImageToStore(coverPicEdit, coverPicName);

            const { data, error } = await supaBase
                .from("profile")
                .update({ cover_pic: coverPicUrl })
                .eq("email", user?.email);

            if (error) {
                ErrorToast(error.message);
                return;
            }
        }

        // Reset the form fields
        setProfilePicEdit(null);
        setCoverPicEdit(null);
        setShowEditImagePopup(false);
    };

    return (
        <React.Fragment>
            {!pageLoading && (
                <header
                    className="py-[5rem] px-4 sm:px-8 flex flex-col gap-6 bg-slate-950 text-center min-h-[20rem] relative mt-2 mx-2 rounded-t-lg"
                    style={{
                        backgroundImage: `url('${coverPicEdit ?? "/cover-photo.png"}')`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                    }}
                >
                    <Image
                        src={
                            typeof profilePicEdit === "string" ? profilePicEdit : "/profile-dp.png"
                        }
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
                        />
                    )}
                </header>
            )}
            <div className="bg-primary-50 flex flex-col 2xs:flex-row justify-between items-center px-4 pb-4 pt-10 shadow-inner md:pl-[15rem] mx-2 rounded-b-lg">
                <div>
                    <h2 className="text-primary text-2xl font-bold">
                        {posts[0]?.author?.first_name ?? (pathUser?.first_name || "")}{" "}
                        {posts[0]?.author?.last_name ?? (pathUser?.last_name || "")}
                    </h2>
                    <p className="text-primary text-base capitalize">
                        {posts[0]?.author?.join_as ?? (pathUser?.join_as || "")}
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
