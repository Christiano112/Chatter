"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { InfoToast, ErrorToast } from "@/components/toast";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import SunEditorCore from "suneditor/src/lib/core";
import supaBase from "@/utils/supabase";
// import parse from "html-react-parser";
import Button from "@/components/button";
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
    };
};

const TextEditor = () => {
    const editor = useRef<SunEditorCore>();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState<string>("");
    const [author_id, setAuthorId] = useState("");
    const [status, setStatus] = useState<
        "draft" | "published" | "deleted" | "archived" | "edited" | ""
    >("");

    useEffect(() => {
        if (user.user_id) {
            setAuthorId(user.user_id);
        } else {
            ErrorToast("No user found, can't make post");
        }
    }, [user]);

    const getSunEditorInstance = (sunEditor: SunEditorCore) => {
        editor.current = sunEditor;
    };

    const handleChange = (content: string) => {
        setContent(content);
    };

    const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const post_id = uuidv4();
        setStatus("draft");

        InfoToast("Post Saved As Draft");
        dispatch(addPost(author_id, title, content, post_id, status));
    };

    const handlePublish = async () => {
        const post_id = uuidv4();
        setStatus("published");
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
        console.log("title::", title, "author_id::", author_id, "content::", content);

        if (title && content && author_id) {
            const mappedData = mapPostDataToColumns({ author_id, title, content, post_id });
            const { error } = await supaBase.from("posts").insert([mappedData]);

            if (error) {
                ErrorToast(error?.message);
                return;
            }
        } else {
            ErrorToast("Error in the posts, please check input");
            return;
        }

        dispatch(addPost(author_id, title, content, post_id, status));
        InfoToast("Post published successfully");
    };

    return (
        <div className="max-w-[80%] mx-auto my-20 shadow-inner rounded-lg p-4 flex flex-col justify-between gap-8">
            <div className="flex justify-end pr-[3rem]">
                <Button
                    text="Publish"
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
                    name={`${author_id}-editor` ?? "text-editor"}
                    width="100%"
                    height="500"
                    placeholder="Start writing..."
                    setOptions={{
                        height: "400",
                        buttonList: [
                            ["font", "fontSize", "formatBlock"],
                            ["paragraphStyle", "blockquote"],
                            ["bold", "underline", "italic", "strike", "subscript", "superscript"],
                            ["fontColor", "hiliteColor", "textStyle"],
                            ["removeFormat"],
                            // "/", // Line break
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
                <button className="bg-primary hover:bg-opacity-70 text-white py-2 px-4 rounded-md w-[10rem] mt-[5rem]">
                    Save As Draft
                </button>
            </form>
        </div>
    );
};

export default TextEditor;
