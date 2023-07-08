"use client";

import React, { useState, memo } from "react";
import { useAppDispatch } from "@/redux/store";
import { PostType, reactionCountAdded, reactionCountDeleted } from "@/redux/slices/posts";
import supaBase from "@/utils/supabase";
import { ErrorToast } from "@/components/toast";

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
    setUpdatedPost: React.Dispatch<React.SetStateAction<any>>;
}

const ReactionButton: React.FC<ReactionButtonProps> = memo(({ post, setUpdatedPost }) => {
    const dispatch = useAppDispatch();
    const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

    const handleReactionCountAdded = async ({
        post_id,
        reaction,
    }: {
        post_id: string;
        reaction: any;
    }) => {
        if (!post.reactions) return;
        const updatedReaction = {
            ...post.reactions,
            [reaction]: (post.reactions[reaction] || 0) + 1,
        };
        const { data: updatedPost, error } = await supaBase
            .from("posts")
            .update({ reactions: updatedReaction })
            .eq("post_id", post_id)
            .select();

        if (error) {
            ErrorToast(error.message);
            return;
        } else {
            setUpdatedPost(updatedPost[0]);
        }
    };

    const handleReactionCountDeleted = async ({
        post_id,
        reaction,
    }: {
        post_id: string;
        reaction: any;
    }) => {
        if (!post.reactions) return;
        const updatedReaction = {
            ...post.reactions,
            [reaction]: (post.reactions[reaction] || 0) - 1,
        };
        const { data: updatedPost, error } = await supaBase
            .from("posts")
            .update({ reactions: updatedReaction })
            .eq("post_id", post_id)
            .select();

        if (error) {
            ErrorToast(error.message);
            return;
        } else {
            setUpdatedPost(updatedPost[0]);
        }
    };

    const handleReactionClick = (reaction: string) => {
        if (selectedReaction === reaction) {
            dispatch(reactionCountDeleted({ post_id: post.post_id, reaction }));
            handleReactionCountDeleted({ post_id: post.post_id, reaction });
            setSelectedReaction(null);
        } else {
            if (selectedReaction) {
                dispatch(
                    reactionCountDeleted({ post_id: post.post_id, reaction: selectedReaction }),
                );
                handleReactionCountDeleted({ post_id: post.post_id, reaction: selectedReaction });
            }
            dispatch(reactionCountAdded({ post_id: post.post_id, reaction }));
            handleReactionCountAdded({ post_id: post.post_id, reaction });
            setSelectedReaction(reaction);
        }
    };

    const reactionButtons = Object.entries(reactionEmojis).map(([name, emoji]) => (
        <button
            key={name}
            className={`mr-2 outline-none text-tertiary-50 ${
                selectedReaction === name ? " font-bold" : ""
            }`}
            onClick={() => handleReactionClick(name)}
            disabled={selectedReaction !== null && selectedReaction !== name}
        >
            {emoji} {post?.reactions?.[name] || 0}
        </button>
    ));

    return <div>{reactionButtons}</div>;
});

ReactionButton.displayName = "ReactionButton";

export default ReactionButton;
