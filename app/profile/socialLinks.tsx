import Link from "next/link";
import { memo, FC } from "react";
import {
    AiFillFacebook,
    AiFillTwitterSquare,
    AiFillInstagram,
    AiFillLinkedin,
    AiFillGithub,
    AiFillMediumSquare,
    AiFillYoutube,
    AiOutlineLink,
} from "react-icons/ai";

const SocialMediaLinks: FC<any> = memo(({ socials }) => {
    const socialMediaPlatforms = [
        {
            link: socials?.facebook_link,
            icon: <AiFillFacebook className="text-3xl" />,
            label: "Facebook",
        },
        {
            link: socials?.twitter_link,
            icon: <AiFillTwitterSquare className="text-3xl" />,
            label: "Twitter",
        },
        {
            link: socials?.instagram_link,
            icon: <AiFillInstagram className="text-3xl" />,
            label: "Instagram",
        },
        {
            link: socials?.linkedin_link,
            icon: <AiFillLinkedin className="text-3xl" />,
            label: "LinkedIn",
        },
        {
            link: socials?.github_link,
            icon: <AiFillGithub className="text-3xl" />,
            label: "Github",
        },
        {
            link: socials?.medium_link,
            icon: <AiFillMediumSquare className="text-3xl" />,
            label: "Medium",
        },
        {
            link: socials?.youtube_link,
            icon: <AiFillYoutube className="text-3xl" />,
            label: "Youtube",
        },
        {
            link: socials?.website_link,
            icon: <AiOutlineLink className="text-3xl" />,
            label: "Website",
        },
    ];

    return (
        <div className="flex flex-row flex-wrap sm:flex-col gap-4 sm:gap-8 px-4 py-8 rounded-lg bg-primary-50 flex-grow max-h-[40rem]">
            <h3 className="text-primary text-xl font-bold">Socials:</h3>
            {socialMediaPlatforms.map(
                (platform) =>
                    platform?.link && (
                        <Link
                            key={platform?.label}
                            href={platform?.link}
                            rel="noreferrer"
                            target="_blank"
                            className="text-primary cursor-pointer flex items-center gap-2"
                        >
                            {platform?.icon}
                            <span>{platform?.label}</span>
                        </Link>
                    ),
            )}
        </div>
    );
});

SocialMediaLinks.displayName = "SocialMediaLinks";

export default SocialMediaLinks;
