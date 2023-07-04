"use client";

import React, { useState, memo } from "react";
import { useAppDispatch } from "@/redux/store";
import { PostType, reactionCountAdded, reactionCountDeleted } from "@/redux/slices/posts";

export const reactionEmojis = {
    like: "👍",
    love: "❤️️",
    haha: "😂",
    thumbsDown: "👎",
};

export const initialReactionValues = {
    like: 0,
    love: 0,
    haha: 0,
    thumbsDown: 0,
};

interface ReactionButtonProps {
    post: PostType;
}

const ReactionButton: React.FC<ReactionButtonProps> = memo(({ post }) => {
    const dispatch = useAppDispatch();
    const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

    const handleReactionClick = (reaction: string) => {
        if (selectedReaction === reaction) {
            dispatch(reactionCountDeleted({ post_id: post.post_id, reaction }));
            setSelectedReaction(null);
        } else {
            if (selectedReaction) {
                dispatch(
                    reactionCountDeleted({ post_id: post.post_id, reaction: selectedReaction }),
                );
            }
            dispatch(reactionCountAdded({ post_id: post.post_id, reaction }));
            setSelectedReaction(reaction);
        }
    };

    const reactionButtons = Object.entries(reactionEmojis).map(([name, emoji]) => (
        <button
            key={name}
            className={`mr-2 text-tertiary-50 ${selectedReaction === name ? " font-bold" : ""}`}
            onClick={() => handleReactionClick(name)}
            disabled={selectedReaction !== null && selectedReaction !== name}
        >
            {emoji} {post?.reactions?.[name] || 0}
        </button>
    ));

    return <div className="border">{reactionButtons}</div>;
});

ReactionButton.displayName = "ReactionButton";

export default ReactionButton;
