import React, { useRef } from "react";
import { EditorState, AtomicBlockUtils, RichUtils } from "draft-js";
import { BsFillCameraFill, BsCameraVideoFill } from "react-icons/bs";

interface CustomOptionPropType {
    onChange: (editorState: EditorState) => void;
    editorState: EditorState;
}

export const CustomUploadOption = ({ onChange, editorState }: CustomOptionPropType) => {
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const videoInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageUpload = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result;
                const contentState = editorState.getCurrentContent();
                const contentStateWithEntity = contentState.createEntity("IMAGE", "IMMUTABLE", {
                    src: imageUrl,
                    alt: "Image",
                });
                const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
                const newEditorState = EditorState.set(editorState, {
                    currentContent: contentStateWithEntity,
                });
                onChange(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoUpload = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const videoUrl = event.target?.result;
                const contentState = editorState.getCurrentContent();
                const contentStateWithEntity = contentState.createEntity("VIDEO", "IMMUTABLE", {
                    src: videoUrl,
                });
                const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
                const newEditorState = EditorState.set(editorState, {
                    currentContent: contentStateWithEntity,
                });
                onChange(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        imageInputRef.current?.click();
    };

    const handleVideoClick = () => {
        videoInputRef.current?.click();
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                multiple={true}
                style={{ display: "none" }}
                onChange={handleImageUpload}
            />
            <input
                type="file"
                accept="video/*"
                ref={videoInputRef}
                style={{ display: "none" }}
                onChange={handleVideoUpload}
            />
            <div className="flex items-center gap-2">
                <div onClick={handleImageClick}>
                    <BsFillCameraFill className="w-8 h-8 shadow-inner p-2 rounded hover:cursor-pointer" />
                </div>
                <div onClick={handleVideoClick}>
                    <BsCameraVideoFill className="w-8 h-8 shadow-inner p-2 rounded hover:cursor-pointer" />
                </div>
            </div>
        </div>
    );
};
export const CustomBlockTypeOption = ({ onChange, editorState }: CustomOptionPropType) => {
    const blockTypes = [
        { label: "Normal", style: "unstyled" },
        { label: "H1", style: "header-one" },
        { label: "H2", style: "header-two" },
        { label: "H3", style: "header-three" },
        { label: "H4", style: "header-four" },
        { label: "H5", style: "header-five" },
        { label: "H6", style: "header-six" },
        { label: "Blockquote", style: "blockquote" },
        { label: "Code", style: "code-block" },
    ];

    const onBlockTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const blockType = event.target.value;
        const newEditorState = RichUtils.toggleBlockType(editorState, blockType);
        onChange(newEditorState);
    };

    const currentBlockType = editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getType();

    return (
        <select
            value={currentBlockType}
            onChange={onBlockTypeChange}
            className="mx-1 h-8 shadow-inner p-2 rounded hover:cursor-pointer"
        >
            {blockTypes.map((blockType) => (
                <option key={blockType.style} value={blockType.style}>
                    {blockType.label}
                </option>
            ))}
        </select>
    );
};

export const CustomFontSizeOption = ({ onChange, editorState }: CustomOptionPropType) => {
    const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96];

    const onFontSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const fontSize = parseInt(event.target.value, 10);
        const newEditorState = RichUtils.toggleInlineStyle(editorState, `FONT-${fontSize}`);
        onChange(newEditorState);
    };

    const currentInlineStyle = editorState.getCurrentInlineStyle();

    const currentFontSize = fontSizes.find((fontSize) =>
        currentInlineStyle.has(`FONT-${fontSize}`),
    );

    return (
        <select
            value={currentFontSize}
            onChange={onFontSizeChange}
            className="mx-1 h-8 shadow-inner p-2 rounded hover:cursor-pointer"
        >
            {fontSizes.map((fontSize) => (
                <option key={fontSize} value={fontSize}>
                    {fontSize}
                </option>
            ))}
        </select>
    );
};

export const CustomFontFamilyOption = ({ onChange, editorState }: CustomOptionPropType) => {
    const fontFamilies = ["Arial", "Georgia", "Impact", "Tahoma", "Times New Roman", "Verdana"];

    const onFontFamilyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const fontFamily = event.target.value;
        const newEditorState = RichUtils.toggleInlineStyle(
            editorState,
            `FONT-FAMILY-${fontFamily}`,
        );
        onChange(newEditorState);
    };

    const currentInlineStyle = editorState.getCurrentInlineStyle();

    const currentFontFamily = fontFamilies.find((fontFamily) =>
        currentInlineStyle.has(`FONT-FAMILY-${fontFamily}`),
    );

    return (
        <select
            value={currentFontFamily}
            onChange={onFontFamilyChange}
            className="mx-1 h-8 shadow-inner p-2 rounded hover:cursor-pointer"
        >
            {fontFamilies.map((fontFamily) => (
                <option key={fontFamily} value={fontFamily}>
                    {fontFamily}
                </option>
            ))}
        </select>
    );
};

// emoji: {
//     emojis: [
//         '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
//         '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
//         '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
//         '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
//         '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
//         '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
//         '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
//         '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
//         '✅', '❎', '💯',
//     ],
//                     },
// colorPicker: {
//     colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
//         'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
//         'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
//         'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
//         'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
//         'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
//                     },
