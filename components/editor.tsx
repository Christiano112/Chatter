"use client";

import { useState, useEffect, ReactHTMLElement } from "react";
import { InfoToast } from "@/components/toast";
import parse from "html-react-parser";
import Button from "@/components/button";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { addPost } from "@/redux/slices/posts";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
    toolbar: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["link", "image", "video"],
        ["clean"],
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: true,
    },
};

const TextEditor = () => {
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isDraft, setIsDraft] = useState(true);
    const [isPublished, setIsPublished] = useState(false);

    useEffect(() => {
        if (content) {
            const parsedContent = parse(content) as ReactHTMLElement<HTMLElement>;
            console.log("parsedContent", parsedContent);
        }
    }, [content]);

    function submitHandler(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const requestObj = {
            id: new Date().toISOString(),
            title: title,
            content: content,
            isDraft: isDraft,
            isPublished: isPublished,
        };

        console.log("requestObj", requestObj);

        InfoToast("Post Saved As Draft");
    }

    const handlePublish = () => {
        setIsDraft(false);
        setIsPublished(true);
        dispatch(addPost(title, content, new Date().toISOString()));
        InfoToast("Post published successfully");
    };

    return (
        <div className="shadow-inner rounded-lg p-4 flex flex-col justify-between gap-8">
            <div className="flex justify-end pr-[3rem]">
                <Button
                    text="Publish"
                    type="button"
                    variant="primary"
                    size="small"
                    handleClick={handlePublish}
                />
            </div>
            <form onSubmit={submitHandler} className="flex flex-col gap-4">
                <label htmlFor="title" className="text-gray-600">
                    Title
                </label>
                <input
                    type="text"
                    value={title}
                    name="title"
                    placeholder="Enter a title"
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                    required
                />
                <QuillNoSSRWrapper
                    modules={modules}
                    onChange={setContent}
                    theme="snow"
                    style={{ height: "10rem" }}
                    placeholder="Start Writing..."
                />
                <button className="bg-primary hover:bg-opacity-70 text-white py-2 px-4 rounded-md w-[10rem] mt-[6rem]">
                    Save As Draft
                </button>
                <p className="text-gray-600">{content}</p>
            </form>
        </div>
    );
};

export default TextEditor;
