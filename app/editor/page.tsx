"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import { SuccessToast, InfoToast, ErrorToast } from "@/components/toast";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import SunEditorCore from "suneditor/src/lib/core";
import supaBase from "@/utils/supabase";
// import parse from "html-react-parser";
import Button, { SavingSpinner } from "@/components/button";
import Header from "@/components/header";
import { initialReactionValues } from "@/components/reactions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/slices/user";
import { PostType, addPost } from "@/redux/slices/posts";

const SunEditor = dynamic(() => import("suneditor-react"), {
    ssr: false,
});

const mapPostDataToColumns = (postData: PostType) => {
    const { author_id, title, content, post_id } = postData;

    return {
        author_id,
        title,
        content,
        post_id,
        reactions: initialReactionValues,
    };
};

const TextEditor = () => {
    const authUser = useUser();
    const editor = useRef<SunEditorCore>();
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const [save, setSave] = useState(false);
    const [showEditor, setShowEditor] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState<string>(" ");
    const [author_id, setAuthorId] = useState(user.user_id);

    useEffect(() => {
        if (authUser?.id || user.user_id) {
            setAuthorId(authUser?.id ?? user.user_id);
        } else {
            ErrorToast("No user found, can't make post");
        }
    }, [authUser, user]);

    // Get saved content from localStorage
    useEffect(() => {
        const savedTitle = localStorage.getItem(`${author_id}-editorTitle`);
        const savedContent = localStorage.getItem(`${author_id}-editorContent`);
        if (savedTitle) {
            setTitle(savedTitle);
        }
        if (savedContent) {
            setContent(savedContent);
        }
    }, [author_id]);

    // Save content to localStorage every 3 minutes
    useEffect(() => {
        const saveContentInterval = setInterval(() => {
            try {
                if (title) localStorage.setItem(`${author_id}-editorTitle`, title);
                if (content) localStorage.setItem(`${author_id}-editorContent`, content);
                setSave(true);
            } catch (error: any) {
                ErrorToast(error?.message);
            } finally {
                setTimeout(() => {
                    setSave(false);
                }, 1000);
            }
        }, 3 * 60 * 1000);

        return () => {
            clearInterval(saveContentInterval);
        };
    }, [title, content, author_id]);

    const handleCloseEditor = () => {
        setShowPopup(true);
    };

    const handleConfirmCloseEditor = () => {
        setShowEditor(false);
        setShowPopup(false);
    };

    const handleCancelCloseEditor = () => {
        setShowPopup(false);
    };

    const getSunEditorInstance = (sunEditor: SunEditorCore) => {
        editor.current = sunEditor;
    };

    const handleChange = (content: string) => {
        setContent(content);
    };

    const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const post_id = uuidv4();
        const status = "draft";

        dispatch(addPost(author_id, title, content, post_id, status, initialReactionValues));
        InfoToast("Post Saved As Draft");

        // Clear localStorage and reset the title and content
        localStorage.removeItem(`${author_id}-editorTitle`);
        localStorage.removeItem(`${author_id}-editorContent`);
        setTitle("");
        setContent("");
    };

    const handlePublish = async () => {
        const post_id = uuidv4();
        const status = "published";

        if (!title || !content) {
            ErrorToast("Please add title and content");
            return;
        } else if (!title) {
            ErrorToast("Please add title");
            return;
        } else if (!content) {
            ErrorToast("Please add content");
            return;
        }
        // console.log("title::", title, "author_id::", author_id, "content::", content);

        if (title && content && author_id) {
            const mappedData = mapPostDataToColumns({
                author_id,
                title,
                content,
                post_id,
                reactions: initialReactionValues,
            });
            const { error } = await supaBase.from("posts").insert([mappedData]);

            if (error) {
                ErrorToast(error?.message);
                return;
            }
        } else {
            ErrorToast("Error in the posts, please check input");
            return;
        }

        dispatch(addPost(author_id, title, content, post_id, status, initialReactionValues));
        SuccessToast("Post published successfully");

        // Clear localStorage and reset the title and content
        localStorage.removeItem(`${author_id}-editorTitle`);
        localStorage.removeItem(`${author_id}-editorContent`);
        setTitle("");
        setContent("");
    };

    return (
        <React.Fragment>
            <Header />
            <h2 className="text-primary text-lg sm:text-2xl my-4 md:my-8 px-2 text-center font-bold">
                Elevate Your Content Creation: Chatter{`'`}s Text Editor is at Your Fingertips
            </h2>
            {showEditor && (
                <div className="max-w-[92%] md:max-w-[80%] mx-auto my-8 md:my-20 shadow-inner rounded-lg p-4 flex flex-col justify-between gap-8 ">
                    <div className="flex justify-end pr-[1.5rem] md:pr-[3rem]">
                        <Button
                            text={save ? <SavingSpinner /> : "Publish"}
                            type="button"
                            variant="primary"
                            size="small"
                            handleClick={handlePublish}
                        />
                    </div>
                    <form onSubmit={handleSave} className="flex flex-col">
                        <label htmlFor="title" className="text-gray-600">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            name="title"
                            placeholder="Enter a title"
                            onChange={(e) => setTitle(e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 text-2xl"
                            required
                        />
                        <SunEditor
                            getSunEditorInstance={getSunEditorInstance}
                            onChange={handleChange}
                            defaultValue={content}
                            name={`${author_id}-editor` ?? "text-editor"}
                            width="100%"
                            height="100%"
                            placeholder="Start writing..."
                            setOptions={{
                                // maxCharCount: 1000000000,
                                // charCounter: true,
                                // charCounterLabel: "Characters",
                                buttonList: [
                                    ["font", "fontSize", "formatBlock"],
                                    [
                                        "bold",
                                        "underline",
                                        "italic",
                                        "strike",
                                        "subscript",
                                        "superscript",
                                    ],
                                    ["fontColor", "hiliteColor", "textStyle"],
                                    ["removeFormat", "paragraphStyle", "blockquote"],
                                    ["outdent", "indent"],
                                    ["align", "horizontalRule", "list", "lineHeight"],
                                    ["table", "link", "image", "video", "audio"],
                                    ["fullScreen", "showBlocks", "codeView"],
                                    ["save"],
                                    ["imageGallery"],
                                    ["preview", "print"],
                                    ["undo", "redo"],
                                ],
                            }}
                        />
                        <div className="flex flex-col xs:flex-row xs:items-center gap-4 sm:gap-8 mt-[5rem]">
                            <button
                                type="submit"
                                className="bg-primary hover:bg-opacity-70 text-white py-2 px-4 rounded-md w-[10rem]"
                            >
                                {save ? <SavingSpinner /> : "Save as Draft"}
                            </button>
                            <button
                                type="button"
                                className="bg-primary-50 hover:bg-opacity-70 text-red-800 font-bold py-2 px-4 rounded-md w-[10rem]"
                                onClick={handleCloseEditor}
                            >
                                Close Editor
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {showPopup && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75">
                    <div className="bg-white rounded-lg shadow-lg px-4 sm:px-8 pt-4 sm:pt-8 pb-0 m-4 max-w-lg w-full">
                        <h2 className="text-xl font-semibold text-tertiary mb-4">
                            Confirm Close Editor
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Are you sure you want to close the editor?
                        </p>
                        <div className="flex justify-end gap-4 pl-4">
                            <Button
                                text="No"
                                type="button"
                                variant="primary"
                                size="small"
                                handleClick={handleCancelCloseEditor}
                            />
                            <Button
                                text="Yes"
                                type="button"
                                variant="secondary"
                                size="small"
                                style={{ fontWeight: "800" }}
                                handleClick={handleConfirmCloseEditor}
                            />
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default TextEditor;
