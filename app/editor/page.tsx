"use client";

import React from "react";
import { EditorState, convertFromRaw } from "draft-js";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import draftToMarkdown from "draftjs-to-markdown";
import draftToHtml from "draftjs-to-html";

const content = {
    entityMap: {},
    blocks: [
        {
            key: "",
            text: "",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        },
    ],
};

const hashConfig = {
    trigger: "#",
    separator: " ",
};

const customEntityTransform = (entity: any) => {
    const entityType = entity.get("type").toLowerCase();
    if (entityType === "mention") {
        return `[${entity.get("data").get("text")}](${entity.get("data").get("url")})`;
    }
    if (entityType === "hashtag") {
        return `[${entity.get("data").get("text")}](${entity.get("data").get("url")})`;
    }
    return undefined;
};

const config = {
    entityToHTML: (entity: any, originalText: any) => {
        if (entity.type === "MENTION") {
            return `<a href="${entity.data.url}">${originalText}</a>`;
        }
        if (entity.type === "LINK") {
            return `<a href="${entity.data.url}">${originalText}</a>`;
        }
        if (entity.type === "IMAGE") {
            return `<img src="${entity.data.src}" alt="${entity.data.alt}" />`;
        }
        return originalText;
    },
};

const TextEditor = () => {
    const [editorState, setEditorState] = React.useState<EditorState>(() =>
        EditorState.createEmpty(),
    );

    const contentState = convertFromRaw(content);
    const rawContentState = editorState.getCurrentContent();
    const markDown = draftToMarkdown(rawContentState, hashConfig, customEntityTransform, config);
    const markUp = draftToHtml(rawContentState, hashConfig, customEntityTransform);

    const [rawContent, setRawContent] = React.useState(contentState);
    const [textValue, setTextValue] = React.useState("");

    const onContentStateChange = (contentState: any) => {
        setRawContent(contentState);
    };

    React.useEffect(() => {
        setTextValue(editorState.getCurrentContent().getPlainText());
    }, [editorState]);

    console.log("rawContent:", rawContent);
    console.log("textValue:", textValue);
    console.log("markDown:", markDown);
    console.log("markUp:", markUp);

    return (
        <React.Fragment>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName rounded"
                wrapperClassName="wrapperClassName bg-slate-500 mx-auto my-20 w-[80%] shadow-inner rounded-lg p-4 h-full max-h-[40rem] min-h-[20rem]"
                editorClassName="editorClassName bg-slate-100 rounded-sm p-2 max-h-[22rem] min-h-[16rem] w-full"
                // toolbarStyle={}
                // wrapperStyle={}
                // editorStyle={}
                onEditorStateChange={setEditorState}
                onContentStateChange={onContentStateChange}
                wrapperId={2} // ID for server side rendering
                mention={{
                    separator: " ",
                    trigger: "@",
                    suggestions: [
                        { text: "APPLE", value: "apple", url: "apple" },
                        { text: "BANANA", value: "banana", url: "banana" },
                        { text: "CHERRY", value: "cherry", url: "cherry" },
                        { text: "DURIAN", value: "durian", url: "durian" },
                        { text: "FIG", value: "fig", url: "fig" },
                        { text: "GRAPEFRUIT", value: "grapefruit", url: "grapefruit" },
                        { text: "HONEYDEW", value: "honeydew", url: "honeydew" },
                    ],
                }}
                hashtag={{
                    separator: " ",
                    trigger: "#",
                }}
            />
        </React.Fragment>
    );
};

export default TextEditor;
