import React, { useCallback, useEffect, useState } from "react";
import supaBase from "@/utils/supabase";
import { ErrorToast } from "@/components/toast";
import { useAppDispatch } from "@/redux/store";
import { addComment } from "@/redux/slices/comments";
import { Json } from "@/utils/types";

export interface DBPostType {
    author_id: string;
    content: string;
    created_at: string | null;
    id: number;
    post_id: string;
    reactions: Json;
    title: string;
    author: {
        first_name: string | null;
        last_name: string | null;
        username: string;
        join_as: string;
        user_id?: string;
    } | null;
    comments: {
        id: number;
    }[];
}

export interface FilteredDBPostType {
    author_id: string;
    content: string;
    created_at: string | null;
    id: number;
    post_id: string;
    reactions: Json;
    title: string;
    author: {
        first_name: string | null;
        last_name: string | null;
        username: string;
        join_as: string;
        user_id: string;
    } | null;
}
[];

export interface CommentType {
    author_id: string;
    comment_id: string;
    content: string | null;
    created_at: string | null;
    id: number;
    author: {
        first_name: string | null;
        last_name: string | null;
        username: string;
    } | null;
}
[];

export const useFetchAllPosts = (page: number, pageSize: number) => {
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState<DBPostType[]>([]);

    const fetchAllPosts = useCallback(async () => {
        try {
            setIsLoading(true);
            let { data: posts, error } = await supaBase
                .from("posts")
                .select(
                    `*,
            author:users(first_name, last_name, username, join_as, user_id),
            comments:comments(id)`,
                )
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
    }, [page, pageSize]);

    useEffect(() => {
        fetchAllPosts();
    }, [fetchAllPosts]);

    return { isLoading, posts };
};

export const useFetchPostsByAuthorId = (page: number, pageSize: number, author_id: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState<DBPostType[]>([]);

    const fetchPostsByAuthorId = useCallback(async () => {
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
    }, [author_id, page, pageSize]);

    useEffect(() => {
        fetchPostsByAuthorId();
    }, [fetchPostsByAuthorId]);

    return { isLoading, posts };
};

export const useFetchPostById = (post_id: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [post, setPost] = useState<DBPostType>();

    const fetchPostById = useCallback(async () => {
        try {
            setIsLoading(true);
            let { data: post, error } = await supaBase
                .from("posts")
                .select(
                    `*,
                    author:users(first_name, last_name, username, join_as),
                    comments:comments(id)`,
                )
                .eq("post_id", post_id)
                .order("created_at", { ascending: false });

            if (error || !post) {
                ErrorToast(error?.message ?? "Error fetching updated post");
                return;
            }

            setPost(post[0]);
        } catch (error: any) {
            ErrorToast(error?.message ?? "Error fetching updated post");
        } finally {
            setIsLoading(false);
        }
    }, [post_id]);

    useEffect(() => {
        fetchPostById();
    }, [fetchPostById]);

    return { isLoading, post };
};

export const useFetchCommentsForPost = () => {
    const [selectedPostComments, setSelectedPostComments] = useState<CommentType[]>([]);

    const fetchCommentsForPost = useCallback(async (post_id: string) => {
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
    }, []);

    return { selectedPostComments, fetchCommentsForPost, setSelectedPostComments };
};

export const usePostInteraction = ({
    author_id,
    fetchCommentsForPost,
    setSelectedPostComments,
}: any) => {
    const [selectedPost, setSelectedPost] = useState<DBPostType>();
    const [newComment, setNewComment] = useState("");

    const dispatch = useAppDispatch();

    const handleCommentClick = useCallback(
        async (post: DBPostType) => {
            setNewComment("");
            setSelectedPostComments([]);
            setSelectedPost(post);
            await fetchCommentsForPost(post?.post_id);
        },
        [fetchCommentsForPost, setSelectedPostComments],
    );

    const handleAddComment = useCallback(
        async (e: React.FormEvent<HTMLButtonElement>) => {
            e.preventDefault();

            if (!newComment.trim() || !selectedPost) {
                ErrorToast("Comment cannot be empty");
                return;
            }

            if (typeof author_id !== "string") return;

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

            // fetch the comments again so it shows instantly
            setTimeout(() => {
                fetchCommentsForPost(selectedPost?.post_id);
            }, 100);

            dispatch(addComment(comment[0]));

            setNewComment("");
        },
        [author_id, dispatch, fetchCommentsForPost, newComment, selectedPost],
    );

    return { selectedPost, newComment, handleCommentClick, handleAddComment, setNewComment };
};

export const useSearchPosts = () => {
    const [filteredPosts, setFilteredPosts] = useState<FilteredDBPostType[] | null>([]);

    const handleSearch = useCallback(async (query: string) => {
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
            .or(`content.ilike.*${query}*, title.ilike.*${query}*`)
            .order("created_at", { ascending: false });

        if (error || filteredPosts?.length === 0) {
            ErrorToast(error?.message ?? "No posts found");
            return;
        } else {
            setFilteredPosts(filteredPosts);
        }
    }, []);

    return { filteredPosts, handleSearch };
};

export const downloadAndSetImage = async (data: any, imageField: string, setImage: any) => {
    if (data[0][imageField]) {
        const { data: imageData, error: imageError } = await supaBase.storage
            .from("avatars")
            .download(data[0][imageField]);

        if (imageError) {
            throw new Error(imageError.message);
        }

        const url = URL.createObjectURL(imageData);
        setImage(url);
    }
};

export const uploadImageToStore = async (file: File, fileName: string): Promise<string> => {
    try {
        const { data, error } = await supaBase.storage.from("avatars").upload(fileName, file);

        if (error) {
            throw error;
        }

        return data?.path ?? "";
    } catch (error: any) {
        ErrorToast(error.message);
        throw error;
    }
};

export const useReactionUpdate = (
    posts: any[],
    setPosts: React.Dispatch<React.SetStateAction<any[] | DBPostType[]>>,
) => {
    const handleReactionUpdate = useCallback(
        (updatedPost: { post_id: string; reactions: any }) => {
            const updatedPostsArray = posts.map((p: { post_id: string }) =>
                p.post_id === updatedPost.post_id ? { ...p, reactions: updatedPost.reactions } : p,
            );
            setPosts(updatedPostsArray);
        },
        [posts, setPosts],
    );

    return { handleReactionUpdate };
};
