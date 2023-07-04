import React, { useEffect, useState } from "react";
import supaBase from "@/utils/supabase";
import { ErrorToast } from "@/components/toast";
import { useAppDispatch } from "@/redux/store";
import { addComment } from "@/redux/slices/comments";

export const useFetchPostsByAuthorId = (page: number, pageSize: number, author_id: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState<any>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                let { data: posts, error } = await supaBase
                    .from("posts")
                    .select(
                        `*,
            author:users(first_name, last_name, username, join_as, user_id),
            comments:comments(id)`,
                    )
                    .eq("author_id", author_id)
                    .range((page - 1) * pageSize, page * pageSize - 1)
                    .order("created_at", { ascending: false });

                if (error || !posts) {
                    ErrorToast(error?.message ?? "Error fetching updated posts");
                    return;
                }

                setPosts(posts);
            } catch (error: any) {
                ErrorToast(error?.message ?? "Error fetching updated post");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [author_id, page, pageSize]);

    return { isLoading, posts };
};

export const useFetchCommentsForPost = () => {
    const [selectedPostComments, setSelectedPostComments] = useState<any>([]);

    const fetchCommentsForPost = async (post_id: string) => {
        let { data: comments, error: commentsError } = await supaBase
            .from("comments")
            .select(
                `
        *,
        author:users(first_name, last_name, username)
      `,
            )
            .eq("comment_id", post_id);

        if (commentsError || !comments) {
            ErrorToast(commentsError?.message ?? "Error fetching comments");
            return;
        }

        setSelectedPostComments(comments);
    };

    return { selectedPostComments, fetchCommentsForPost };
};

export const usePostInteraction = ({ author_id, fetchCommentsForPost }: any) => {
    const [selectedPost, setSelectedPost] = useState<any>([]);
    const [newComment, setNewComment] = useState("");

    const dispatch = useAppDispatch();

    const handleCommentClick = async (post: any) => {
        setNewComment("");
        // setSelectedPostComments([]);
        setSelectedPost(post);
        await fetchCommentsForPost(post?.post_id);
    };

    const handleAddComment = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!newComment.trim() || !selectedPost) {
            ErrorToast("Comment cannot be empty");
            return;
        }

        const { data: comment, error } = await supaBase
            .from("comments")
            .insert([
                {
                    author_id: author_id,
                    comment_id: selectedPost?.post_id,
                    content: newComment,
                },
            ])
            .select();

        if (error || !comment) {
            ErrorToast(error?.message ?? "Error adding comment");
            return;
        }

        dispatch(addComment(comment[0]));

        setNewComment("");
    };

    return { selectedPost, newComment, handleCommentClick, handleAddComment };
};

export const useSearchPosts = ({ pathId }: { pathId: string }) => {
    const [filteredPosts, setFilteredPosts] = useState<any>([]);

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            return;
        }

        let { data: filteredPosts, error } = await supaBase
            .from("posts")
            .select(
                `
        *,
        author:users(first_name, last_name, username, join_as, user_id)
      `,
            )
            .eq("author_id", pathId)
            .or(`content.ilike.*${query}*, title.ilike.*${query}*`)
            .order("created_at", { ascending: false });

        if (error || !filteredPosts || filteredPosts.length === 0) {
            ErrorToast(error?.message ?? "No posts found");
            return;
        } else {
            setFilteredPosts(filteredPosts);
        }
    };

    return { filteredPosts, handleSearch };
};
