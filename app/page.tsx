import React from "react";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { NavigateBtn } from "@/components/button";
import People from "/public//people.jpeg";
import AnalyticImage from "/public/analytics.png";
import SocialImage from "/public/social.png";
import ContentImage from "/public/content.png";
import ManImage from "/public/man.png";
import SmilingGirlImage from "/public/smiling-girl.png";
import MaleImage from "/public/male.png";
import GirlImage from "/public/girl.png";

const whyContent = [
    {
        image: AnalyticImage,
        title: "Analytics",
        description:
            "Analytics to track the number of views, likes and comment and also analyze the performance of your articles over a period of time",
    },
    {
        image: SocialImage,
        title: "Social interactions",
        description:
            "Users on the platform can interact with posts they like, comment and engage in discussions",
    },
    {
        image: ContentImage,
        title: "Content creation",
        description: "Write nice and appealing with our in-built markdown, a rich text editor",
    },
];

export default function Home() {
    return (
        <React.Fragment>
            <Header />
            <main
                className="py-[5rem] px-4 sm:px-8 flex flex-col gap-6 bg-slate-950 text-center"
                style={{
                    background: "url('/main-bg.png') center no-repeat",
                    backgroundSize: "cover",
                }}
            >
                <h1 className="text-white text-bold text-3xl md:text-6xl">
                    Welcome to Chatter: A Haven for Text-Based Content
                </h1>
                <p className="text-white text-medium">
                    Unleash the Power of Words, Connect with Like-minded Readers and Writers
                </p>
                <NavigateBtn text="Get Started" direction="feeds" size="small" />
            </main>
            <section className="flex flex-col gap-8 md:gap-12 justify-between items-center md:flex-row py-[5rem] mx-auto w-[90%]">
                <div className="md:w-[60%]">
                    <h2 className="text-tertiary font-bold text-2xl md:text-5xl mb-4 md:mb-8">
                        About Chatter
                    </h2>
                    <p className="text-tertiary">
                        Chatter is a multi-functional platform where authors and readers can have
                        access to their own content. It aims to be a traditional bookworm’s heaven
                        and a blog to get access to more text based content. Our vision is to foster
                        an inclusive and vibrant community where diversity is celebrated. We
                        encourage open-mindedness and respect for all individuals, regardless of
                        their backgrounds or beliefs. By promoting dialogue and understanding.
                    </p>
                </div>
                <Image src={People} alt="people" width={500} height={700} />
            </section>
            <section className="flex flex-col gap-8 md:gap-12 justify-between items-center py-[5rem] mx-auto w-[90%]">
                <div className="text-center">
                    <h2 className="text-tertiary font-bold text-2xl md:text-5xl mb-4 md:mb-8">
                        Why you should join chatter
                    </h2>
                    <p className="text-tertiary">
                        Our goal is to make writers and readers see our platform as their next
                        heaven for blogging, ensuring ease in interactions, connecting with
                        like-minded peers, have access to favorite content based on interests and
                        able to communicate your great ideas with people
                    </p>
                </div>
                <div className="flex flex-wrap gap-4 justify-evenly items-center">
                    {whyContent.map((content, index) => (
                        <div key={index} className="shadow-inner p-4 hover:scale-105 h-64 w-64">
                            <Image src={content.image} alt="people" width={50} height={50} />
                            <h3 className="text-tertiary font-bold text-xl my-4">
                                {content.title}
                            </h3>
                            <p className="text-tertiary-50">{content.description}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className="bg-secondary-50 flex flex-col gap-6 justify-between items-center 2xs:flex-row py-[5rem] px-6 md:px-8">
                <Image
                    src={ManImage}
                    alt="man"
                    width={200}
                    height={200}
                    className="rounded-full min-h-[14rem] min-w-[14rem] max-h-[18rem] max-w-[18rem]"
                />
                <div className="md:w-[80%]">
                    <p className="text-tertiary">
                        Chatter has become an integral part of my online experience. As a user of
                        this incredible blogging platform, I have discovered a vibrant community of
                        individuals who are passionate about sharing their ideas and engaging in
                        thoughtful discussions.”
                    </p>
                    <h3 className="text-tertiary font-bold text-xl my-4 2xs:my-2">
                        Patrick Lean,{" "}
                        <span className="font-normal text-base">Software developer at Apple</span>
                    </h3>
                    <NavigateBtn text="Join Chatter" direction="feeds" size="small" />
                </div>
            </section>
            <section className="flex flex-col gap-6 justify-between items-center md:flex-row py-[5rem] px-6 md:px-8">
                <div className="flex flex-col gap-8">
                    <Image
                        src={SmilingGirlImage}
                        alt="smiling girl"
                        width={200}
                        height={200}
                        className="rounded-full min-h-[6rem] min-w-[6rem] mr-auto"
                    />
                    <Image
                        src={MaleImage}
                        alt="male"
                        width={200}
                        height={200}
                        className="rounded-full min-h-[6rem] min-w-[6rem] ml-8 md:ml-[5rem]"
                    />
                    <Image
                        src={GirlImage}
                        alt="girl"
                        width={200}
                        height={200}
                        className="rounded-full min-h-[6rem] min-w-[6rem] mr-auto"
                    />
                </div>
                <div className="md:w-[60%]">
                    <h2 className="text-tertiary font-bold text-2xl md:text-5xl mb-4 md:mb-8">
                        Write, read and connect with great minds on chatter
                    </h2>
                    <p className="text-tertiary">
                        Share people your great ideas, and also read write-ups based on your
                        interests. connect with people of same interests and goals.
                    </p>
                    <NavigateBtn text="Get Started" direction="feeds" size="small" />
                </div>
            </section>
            <Footer />
        </React.Fragment>
    );
}
