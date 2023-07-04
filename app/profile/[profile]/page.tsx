"use client";

import React, { useState, useEffect } from "react";
import { usePathId, useCheckAuth } from "@/utils/custom";
import Image from "next/image";
import Link from "next/link";
import {
    AiFillMessage,
    AiFillFacebook,
    AiFillTwitterSquare,
    AiFillLinkedin,
    AiFillInstagram,
    AiFillGithub,
    AiFillMediumSquare,
    AiFillYoutube,
    AiOutlineLink,
    AiOutlineForm,
    AiFillCaretLeft,
    AiFillCaretRight,
} from "react-icons/ai";
import Button from "@/components/button";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import "react-tabs/style/react-tabs.css";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { selectUser, updateUser } from "@/redux/slices/user";
import {
    useFetchPostsByAuthorId,
    useFetchCommentsForPost,
    usePostInteraction,
    useSearchPosts,
} from "@/hooks/useDBFetch";
import PostComponent from "@/components/post";
import Input from "@/components/input";
import Select from "@/components/select";
import { ErrorToast, SuccessToast } from "@/components/toast";
import {
    useUpdateUserForm,
    useSocialLinkForm,
    UpdateUserType,
    SocialLinkType,
    professions,
} from "@/utils/form";
import supaBase from "@/utils/supabase";

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

const Profile = () => {
    const pathId = usePathId();
    const { user } = useCheckAuth();
    const { user: pathUser } = useAppSelector<any>(selectUser);
    const [showPopup, setShowPopup] = useState(false);
    const [page, setPage] = useState(1);
    const [activeTabIndex, setActiveTabIndex] = useState(2);
    const [activeEditTab, setActiveEditTab] = useState(1);
    const [socials, setSocials] = useState<SocialLinkType>({});
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

    useEffect(() => {
        const fetchSocials = async () => {
            const { data, error } = await supaBase
                .from("profile")
                .select("socials")
                .eq("email", user?.email);

            if (error) {
                ErrorToast(error.message);
                return;
            }

            if (!isEmptyObject(data)) {
                setSocials(data[0].socials);
            }
        };

        fetchSocials();
    }, [user?.email]);

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
                const { data, error } = await supaBase
                    .from("profile")
                    .insert([{ socials: filteredSocialData }])
                    .eq("email", user?.email)
                    .select();

                if (error) {
                    ErrorToast(error.message);
                    return;
                }
            }

            SuccessToast("Social links updated successfully");
        } catch (error) {
            console.log("error=e", error);
            ErrorToast("An error occurred. Please try again later.");
        } finally {
            setShowPopup(false);
        }
    };

    const { register, handleFormSubmit, errors } = useUpdateUserForm(onEditSubmit);
    const {
        register: socialFormRegister,
        handleFormSubmit: socialFormSubmit,
        errors: socialFormErrors,
    } = useSocialLinkForm(handleSocialFormSubmit);

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
            <div className="flex justify-between gap-4 m-4">
                <div className="flex flex-col gap-8 px-4 py-8 rounded-lg bg-primary-50 flex-grow max-h-[40rem]">
                    <h3 className="text-primary text-xl font-bold">Socials</h3>
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
            {showPopup && (
                <div className="z-50 inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75">
                    <div className="bg-white rounded-lg shadow-lg px-4 sm:px-8 pt-4 sm:pt-8 pb-0 m-4 w-full max-w-[80%]">
                        <Button
                            text="Cancel Editing"
                            type="button"
                            size="medium"
                            style={{ fontWeight: "800", backgroundColor: "red" }}
                            handleClick={() => setShowPopup(false)}
                        />
                        <div className="py-8 pr-8 overflow-y-scroll">
                            {activeEditTab === 1 ? (
                                <form onSubmit={handleFormSubmit}>
                                    <h3 className="text-2xl px-4 text-primary font-medium">
                                        Edit Profile
                                    </h3>
                                    <Input
                                        label="First Name"
                                        name="first_name"
                                        placeholder="Enter your first name"
                                        type="text"
                                        autoComplete="name"
                                        register={register}
                                        errors={errors}
                                    />
                                    <Input
                                        label="Last Name"
                                        name="last_name"
                                        placeholder="Enter your last name"
                                        type="text"
                                        autoComplete="name"
                                        register={register}
                                        errors={errors}
                                    />
                                    <Input
                                        label="Username"
                                        name="username"
                                        placeholder="Enter your username"
                                        type="text"
                                        autoComplete="username"
                                        register={register}
                                        errors={errors}
                                    />
                                    <Select
                                        label="Profession"
                                        name="join_as"
                                        register={register}
                                        options={professions}
                                        errors={errors}
                                    />
                                    <Button
                                        text="Edit Profile"
                                        type="submit"
                                        size="medium"
                                        variant="primary"
                                        handleClick={handleFormSubmit}
                                    />
                                </form>
                            ) : (
                                <form onSubmit={socialFormSubmit}>
                                    <h3 className="text-2xl px-4 text-primary font-medium">
                                        Social Links
                                    </h3>
                                    <Input
                                        label="Facebook"
                                        name="facebook_link"
                                        placeholder="Enter your facebook profile link"
                                        type="url"
                                        register={socialFormRegister}
                                        errors={socialFormErrors}
                                    />
                                    <Input
                                        label="Twitter"
                                        name="twitter_link"
                                        placeholder="Enter your twitter profile link"
                                        type="url"
                                        register={socialFormRegister}
                                        errors={socialFormErrors}
                                    />
                                    <Input
                                        label="Instagram"
                                        name="instagram_link"
                                        placeholder="Enter your instagram profile link"
                                        type="url"
                                        register={socialFormRegister}
                                        errors={socialFormErrors}
                                    />
                                    <Input
                                        label="LinkedIn"
                                        name="linkedin_link"
                                        placeholder="Enter your linkedIn profile link"
                                        type="url"
                                        register={socialFormRegister}
                                        errors={socialFormErrors}
                                    />
                                    <Input
                                        label="Github"
                                        name="github_link"
                                        placeholder="Enter your github profile link"
                                        type="url"
                                        register={socialFormRegister}
                                        errors={socialFormErrors}
                                    />
                                    <Input
                                        label="Medium"
                                        name="medium_link"
                                        placeholder="Enter your medium profile link"
                                        type="url"
                                        register={socialFormRegister}
                                        errors={socialFormErrors}
                                    />
                                    <Input
                                        label="Youtube"
                                        name="youtube_link"
                                        placeholder="Enter your youtube link"
                                        type="url"
                                        register={socialFormRegister}
                                        errors={socialFormErrors}
                                    />
                                    <Input
                                        label="Website"
                                        name="website_link"
                                        placeholder="Enter your website/portfolio link"
                                        type="url"
                                        register={socialFormRegister}
                                        errors={socialFormErrors}
                                    />
                                    <Button
                                        text="Update Social Links"
                                        type="submit"
                                        size="medium"
                                        variant="primary"
                                        handleClick={socialFormSubmit}
                                    />
                                </form>
                            )}
                            <div className="flex items-center justify-end my-4">
                                <button
                                    onClick={() =>
                                        setActiveEditTab((activeEditTab) => activeEditTab - 1)
                                    }
                                    className="px-4 py-2 mr-2 text-white bg-primary rounded outline-0 select-none"
                                    disabled={activeEditTab === 1}
                                >
                                    <AiFillCaretLeft />
                                </button>
                                <button
                                    onClick={() =>
                                        setActiveEditTab((activeEditTab) => activeEditTab + 1)
                                    }
                                    className="px-4 py-2 text-white bg-primary rounded outline-0 select-none"
                                    disabled={activeEditTab === 2}
                                >
                                    <AiFillCaretRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default Profile;
