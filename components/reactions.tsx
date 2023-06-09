import React, { useState } from "react";
import { useAppDispatch } from "@/redux/store";
import { PostType, reactionAdded, reactionDeleted } from "@/redux/slices/posts";

export const reactionEmojis = {
    like: "👍",
    love: "❤️️",
    haha: "😂",
    wow: "😮",
    sad: "😢",
    angry: "😡",
    thumbsUp: "👍",
    thumbsDown: "👎",
    fire: "🔥",
    clapping: "👏",
};

interface ReactionButtonProps {
    post: PostType;
}

const ReactionButton: React.FC<ReactionButtonProps> = React.memo(({ post }) => {
    const dispatch = useAppDispatch();
    const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

    const handleReactionClick = (reaction: string) => {
        if (selectedReaction === reaction) {
            dispatch(reactionDeleted({ postId: post.id, reaction }));
            setSelectedReaction(null);
        } else {
            if (selectedReaction) {
                dispatch(reactionDeleted({ postId: post.id, reaction: selectedReaction }));
            }
            dispatch(reactionAdded({ postId: post.id, reaction }));
            setSelectedReaction(reaction);
        }
    };

    const reactionButtons = Object.entries(reactionEmojis).map(([name, emoji]) => (
        <button
            key={name}
            className={`mr-2${selectedReaction === name ? " selected" : ""}`}
            onClick={() => handleReactionClick(name)}
            disabled={selectedReaction !== null && selectedReaction !== name}
        >
            {emoji} {post.reactions?.[name] || 0}
        </button>
    ));

    return <div className="border border-blue-600">{reactionButtons}</div>;
});

ReactionButton.displayName = "ReactionButton";

export default ReactionButton;
