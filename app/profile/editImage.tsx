import React from "react";
import Button from "@/components/button";

interface EditImagesPopupPropsType {
    handlePictureUpload: (e: React.FormEvent<HTMLFormElement>) => void;
    handleProfilePicChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCoverPicChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const EditImagesPopup = ({
    handlePictureUpload,
    handleProfilePicChange,
    handleCoverPicChange,
}: EditImagesPopupPropsType) => {
    return (
        <form className="py-4" onSubmit={handlePictureUpload}>
            <h3 className="text-2xl px-4 mb-4 text-primary font-medium">Edit Images</h3>
            <div className="mb-4">
                <label htmlFor="profilePic" className="block mb-2 font-medium text-primary">
                    Profile Picture:
                </label>
                <input
                    type="file"
                    id="profilePic"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="py-2 px-4 border rounded w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="coverPic" className="block mb-2 font-medium text-primary">
                    Cover Picture:
                </label>
                <input
                    type="file"
                    id="coverPic"
                    accept="image/*"
                    onChange={handleCoverPicChange}
                    className="py-2 px-4 border rounded w-full"
                />
            </div>

            {/* Save Images button */}
            <Button
                text="Save Images"
                type="submit"
                size="medium"
                variant="primary"
                handleClick={handlePictureUpload}
            />
        </form>
    );
};

export default EditImagesPopup;
