"use client";

import React, { useRef } from "react";
import { EditorState, convertToRaw, Modifier, AtomicBlockUtils } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { InfoToast } from "@/components/toast";
import draftToHtml from "draftjs-to-html";
import parse from "html-react-parser";
import Button from "@/components/button";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { addPost } from "@/redux/slices/posts";
import {
    CustomUploadOption,
    CustomBlockTypeOption,
    CustomFontFamilyOption,
    CustomFontSizeOption,
} from "./customOptions";

const TextEditor = () => {
    const [editorState, setEditorState] = React.useState<EditorState>(() =>
        EditorState.createEmpty(),
    );
    const [notes, setNotes] = React.useState<string>("");
    const editor = useRef<Editor>(null);
    const dispatch = useAppDispatch();

    const handleEditorStateChange = (newEditorState: EditorState) => {
        setEditorState(newEditorState);
    };

    React.useEffect(() => {
        if (editorState.getCurrentContent().hasText()) {
            const htmlValue = draftToHtml(convertToRaw(editorState.getCurrentContent()));
            setNotes(htmlValue);
            console.log("notes", notes);
        }
    }, [editorState, notes]);

    const handlePublish = () => {
        InfoToast("Article Published Successfully");
        const title = parse(notes).toString().slice(0, 20);
        const content = parse(notes).toString();
        dispatch(addPost(title, content, "100000"));
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
            <Editor
                toolbarClassName="toolbarClassName rounded"
                wrapperClassName="wrapperClassName mx-auto w-[96%] shadow-inner rounded-lg p-4 h-full max-h-[40rem] min-h-[20rem]"
                editorClassName="editorClassName bg-primary-50 rounded-sm p-4 max-h-[22rem] min-h-[16rem] w-full"
                editorState={editorState}
                onEditorStateChange={handleEditorStateChange}
                toolbarCustomButtons={[
                    <CustomUploadOption
                        key={1}
                        editorState={editorState}
                        onChange={handleEditorStateChange}
                    />,
                    <CustomBlockTypeOption
                        key={2}
                        editorState={editorState}
                        onChange={handleEditorStateChange}
                    />,
                    <CustomFontFamilyOption
                        key={3}
                        editorState={editorState}
                        onChange={handleEditorStateChange}
                    />,
                    <CustomFontSizeOption
                        key={4}
                        editorState={editorState}
                        onChange={handleEditorStateChange}
                    />,
                ]}
                wrapperId={2}
                placeholder="Start typing..."
                spellCheck={true}
                ref={editor}
                mention={{
                    separator: " ",
                    trigger: "@",
                    suggestions: [
                        { text: "APPLE", value: "apple", url: "apple" },
                        { text: "BANANA", value: "banana", url: "banana" },
                        { text: "CHERRY", value: "cherry", url: "cherry" },
                        { text: "DURIAN", value: "durian", url: "durian" },
                    ],
                }}
                hashtag={{
                    separator: " ",
                    trigger: "#",
                    suggestions: [
                        { text: "APPLE", value: "apple", url: "apple" },
                        { text: "BANANA", value: "banana", url: "banana" },
                        { text: "CHERRY", value: "cherry", url: "cherry" },
                        { text: "DURIAN", value: "durian", url: "durian" },
                    ],
                }}
                toolbar={{
                    options: ["inline", "list", "textAlign", "remove", "history"],
                    inline: {
                        options: [
                            "bold",
                            "italic",
                            "underline",
                            "strikethrough",
                            "monospace",
                            "superscript",
                            "subscript",
                        ],
                    },
                    list: {
                        inDropdown: false,
                        options: ["unordered", "ordered"],
                    },
                    textAlign: {
                        inDropdown: false,
                        options: ["left", "center", "right", "justify"],
                    },
                    remove: {
                        options: ["remove", "cancel"],
                    },
                    history: {
                        inDropdown: false,
                        options: ["undo", "redo"],
                    },
                }}
            />
            <div>{parse(notes)}</div>
        </div>
    );
};

export default TextEditor;
