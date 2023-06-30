"use client";

import React, { useState } from "react";
import { usePathId } from "@/utils/custom";
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
} from "react-icons/ai";
import Button from "@/components/button";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import "react-tabs/style/react-tabs.css";
// import { useAppDispatch, useAppSelector } from "@/redux/store";

const Profile = () => {
    const pathId = usePathId();
    const [activeTabIndex, setActiveTabIndex] = useState(2);

    const handleTabChange = (index: number) => {
        setActiveTabIndex(index);
    };

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
                    <h2 className="text-primary text-2xl font-bold">Charles Deo</h2>
                    <p className="text-primary text-sm font-light">Software Engineer</p>
                </div>
                <div className="flex items-center gap-4">
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
                    {/* For Owner */}
                    {/* <Button
                        text="Edit Profile"
                        type="button"
                        size="small"
                        variant="primary"
                    // handleClick={}
                    /> */}
                </div>
            </div>
            <div className="flex justify-between gap-4 m-4">
                <div className="flex flex-col gap-8 px-4 py-8 rounded-lg bg-primary-50 flex-grow">
                    <h3 className="text-primary text-xl font-bold">Socials</h3>
                    <Link
                        href={""}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillFacebook className="text-3xl" />
                        <span>Facebook</span>
                    </Link>
                    <Link
                        href={""}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillInstagram className="text-3xl" />
                        <span>Instagram</span>
                    </Link>
                    <Link
                        href={""}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillTwitterSquare className="text-3xl" />
                        <span>Twitter</span>
                    </Link>
                    <Link
                        href={""}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillLinkedin className="text-3xl" />
                        <span>Linkedin</span>
                    </Link>
                    <Link
                        href={""}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillGithub className="text-3xl" />
                        <span>Github</span>
                    </Link>
                    <Link
                        href={""}
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
                            <h2>Personal Posts</h2>
                        </TabPanel>
                    </Tabs>
                </div>
                <div className="flex flex-col gap-8 px-4 py-8 rounded-lg bg-primary-50 flex-grow">
                    <h3 className="text-primary text-xl font-medium">You might know</h3>
                    <Link
                        href={""}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillFacebook className="text-3xl" />
                        <span>Lobanovskiy</span>
                    </Link>
                    <Link
                        href={""}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillInstagram className="text-3xl" />
                        <span>Eddie</span>
                    </Link>
                    <Link
                        href={""}
                        rel="noreferrer"
                        className="text-primary cursor-pointer flex items-center gap-2"
                    >
                        <AiFillTwitterSquare className="text-3xl" />
                        <span>Tkacheve</span>
                    </Link>
                    <Link
                        href={""}
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
