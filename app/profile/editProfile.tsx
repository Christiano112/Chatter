import React from "react";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import Button from "@/components/button";
import Input from "@/components/input";
import Select from "@/components/select";
import { professions } from "@/utils/form";

interface EditProfilePopupPropsType {
    activeEditTab: number;
    handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    socialFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    setActiveEditTab: React.Dispatch<React.SetStateAction<number>>;
    register: any;
    errors: any;
    socialFormRegister: any;
    socialFormErrors: any;
}

const EditProfilePopup = React.memo(
    ({
        activeEditTab,
        handleFormSubmit,
        socialFormSubmit,
        setActiveEditTab,
        register,
        errors,
        socialFormRegister,
        socialFormErrors,
    }: EditProfilePopupPropsType) => {
        return (
            <form onSubmit={activeEditTab === 1 ? handleFormSubmit : socialFormSubmit}>
                <h3 className="text-2xl px-4 mb-4 text-primary font-medium">
                    Edit {activeEditTab === 1 ? "Profile" : "Social Links"}
                </h3>
                {activeEditTab === 1 ? (
                    <form onSubmit={handleFormSubmit}>
                        <Input
                            label="First Name"
                            name="first_name"
                            placeholder="first name"
                            type="text"
                            autoComplete="name"
                            register={register}
                            errors={errors}
                        />
                        <Input
                            label="Last Name"
                            name="last_name"
                            placeholder="last name"
                            type="text"
                            autoComplete="name"
                            register={register}
                            errors={errors}
                        />
                        <Input
                            label="Username"
                            name="username"
                            placeholder="username"
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
                        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 w-full">
                            <Input
                                label="Facebook"
                                name="facebook_link"
                                placeholder="facebook profile link"
                                type="url"
                                register={socialFormRegister}
                                errors={socialFormErrors}
                            />
                            <Input
                                label="Twitter"
                                name="twitter_link"
                                placeholder="twitter profile link"
                                type="url"
                                register={socialFormRegister}
                                errors={socialFormErrors}
                            />
                            <Input
                                label="Instagram"
                                name="instagram_link"
                                placeholder="instagram profile link"
                                type="url"
                                register={socialFormRegister}
                                errors={socialFormErrors}
                            />
                            <Input
                                label="LinkedIn"
                                name="linkedin_link"
                                placeholder="linkedIn profile link"
                                type="url"
                                register={socialFormRegister}
                                errors={socialFormErrors}
                            />
                            <Input
                                label="Github"
                                name="github_link"
                                placeholder="github profile link"
                                type="url"
                                register={socialFormRegister}
                                errors={socialFormErrors}
                            />
                            <Input
                                label="Medium"
                                name="medium_link"
                                placeholder="medium profile link"
                                type="url"
                                register={socialFormRegister}
                                errors={socialFormErrors}
                            />
                            <Input
                                label="Youtube"
                                name="youtube_link"
                                placeholder="youtube link"
                                type="url"
                                register={socialFormRegister}
                                errors={socialFormErrors}
                            />
                            <Input
                                label="Website"
                                name="website_link"
                                placeholder="website/portfolio link"
                                type="url"
                                register={socialFormRegister}
                                errors={socialFormErrors}
                            />
                        </div>
                        <Button
                            text="Update Social Links"
                            type="submit"
                            size="medium"
                            variant="primary"
                            handleClick={socialFormSubmit}
                        />
                    </form>
                )}
                {/* Navigation buttons */}
                <div className="flex items-center justify-end my-4">
                    <button
                        onClick={() => setActiveEditTab((activeEditTab) => activeEditTab - 1)}
                        className="px-4 py-2 mr-2 text-white bg-primary rounded outline-0 select-none"
                        disabled={activeEditTab === 1}
                    >
                        <AiFillCaretLeft />
                    </button>
                    <button
                        onClick={() => setActiveEditTab((activeEditTab) => activeEditTab + 1)}
                        className="px-4 py-2 text-white bg-primary rounded outline-0 select-none"
                        disabled={activeEditTab === 2}
                    >
                        <AiFillCaretRight />
                    </button>
                </div>
            </form>
        );
    },
);

EditProfilePopup.displayName = "EditProfilePopup";

export default EditProfilePopup;
