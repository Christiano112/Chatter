import React, { useCallback, useEffect, useState } from "react";
import supaBase from "@/utils/supabase";
import { ErrorToast, SuccessToast } from "@/components/toast";
import { useAppDispatch } from "@/redux/store";
import { addComment } from "@/redux/slices/comments";
import { UserType, updateUser } from "@/redux/slices/user";
import { SocialLinkType, UpdateUserType } from "@/utils/form";
import { Json } from "@/utils/types";
import { User } from "@supabase/supabase-js";

export const mapUpdateDataToColumns = (updateData: UpdateUserType) => {
    const { first_name, last_name, username, join_as, email } = updateData;

    return {
        first_name,
        last_name,
        username,
        join_as,
        email,
    };
};

export const isEmptyObject = (obj: any) => {
    return Object.keys(obj).length === 0;
};

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
            if (typeof author_id !== "string" || !author_id) {
                ErrorToast("Invalid author id");
                return;
            }

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
            if (typeof post_id !== "string" || !post_id) {
                ErrorToast("Invalid post id");
                return;
            }

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

            if (typeof author_id !== "string" || !author_id) {
                ErrorToast("Invalid author id");
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

export const useProfile = (pathId: string, user: UserType | User | null) => {
    const dispatch = useAppDispatch();
    const [pageLoading, setPageLoading] = useState(true);
    const [socials, setSocials] = useState<Json | SocialLinkType | any>({});
    const [profilePicEdit, setProfilePicEdit] = useState<File | null>(null);
    const [coverPicEdit, setCoverPicEdit] = useState<File | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showEditImagePopup, setShowEditImagePopup] = useState(false);

    const downloadAndSetImage = useCallback(
        async (data: any, imageField: string, setImage: any) => {
            // if (isEmptyObject(data)) return;

            if (data?.[imageField]) {
                const { data: imageData, error: imageError } = await supaBase.storage
                    .from("avatars")
                    .download(data?.[imageField]);

                console.log("DDDimageField:::", imageField, "DDDimageData:::", imageData);

                if (imageError) {
                    throw new Error(imageError.message);
                }

                const url = URL.createObjectURL(imageData);
                setImage(url);
            }
        },
        [],
    );

    const uploadImageToStore = useCallback(
        async (file: File, fileName: string): Promise<string> => {
            try {
                // if (!file || !fileName.includes("undefined")) {
                //     throw new Error("Invalid file");
                // }
                const { data, error } = await supaBase.storage
                    .from("avatars")
                    .upload(fileName, file);

                if (error) {
                    throw error;
                }

                return data?.path ?? "";
            } catch (error: any) {
                ErrorToast(error.message);
                throw error;
            }
        },
        [],
    );

    const fetchProfile = useCallback(async () => {
        try {
            setPageLoading(true);
            if (!pathId) return;

            const { data: currentEmail, error: emailError } = await supaBase
                .from("users")
                .select("email")
                .eq("user_id", pathId);

            if (emailError) {
                throw new Error(emailError.message);
            }

            if (!currentEmail[0].email) return;

            const { data, error } = await supaBase
                .from("profile")
                .select("*")
                .eq("email", currentEmail[0].email);

            if (data?.length === 0) return;

            if (error) {
                return Promise.reject(error);
            }

            // If socials exist, set the socials state
            if (!isEmptyObject(data)) {
                setSocials(data[0].socials);
            }

            // Download profile and cover pics
            await Promise.all([
                downloadAndSetImage(data[0], "profile_pic", setProfilePicEdit),
                downloadAndSetImage(data[0], "cover_pic", setCoverPicEdit),
            ]);
        } catch (error: any) {
            ErrorToast(error.message);
        } finally {
            setPageLoading(false);
        }
    }, [pathId, downloadAndSetImage]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const onEditSubmit = useCallback(
        async (data: UpdateUserType) => {
            const mappedData: {
                email?: string;
                first_name?: string;
                join_as?: string;
                last_name?: string;
                username?: string;
                [key: string]: string | undefined;
            } = mapUpdateDataToColumns(data);

            // Remove empty fields from mappedData
            for (const key in mappedData) {
                if (mappedData.hasOwnProperty(key) && !mappedData[key]) {
                    delete mappedData[key];
                }
            }

            if (!user?.email) {
                ErrorToast("Invalid Request, Can't Edit Profile");
                return;
            }

            const { data: dbData, error } = await supaBase
                .from("users")
                .update(mappedData)
                .eq("email", user?.email)
                .select();

            if (error) {
                ErrorToast(error.message);
                return;
            }

            dispatch(updateUser(mappedData));
            SuccessToast("Profile updated successfully");
            setShowPopup(false);
        },
        [dispatch, user?.email],
    );

    const handleSocialFormSubmit = useCallback(
        async (socialData: SocialLinkType) => {
            try {
                // Remove empty fields from socialData
                const filteredSocialData = Object.entries(socialData).reduce(
                    (acc: SocialLinkType, [key, value]) => {
                        if (value !== "") {
                            acc[key] = value;
                        }
                        return acc;
                    },
                    {},
                );

                if (!isEmptyObject(socials)) {
                    // If socials exist, update the specific fields
                    const updatedSocials = { ...socials, ...filteredSocialData };

                    const { data, error } = await supaBase
                        .from("profile")
                        .update({ socials: updatedSocials })
                        .eq("email", user?.email)
                        .select();

                    if (error) {
                        ErrorToast(error.message);
                        return;
                    }
                } else {
                    // If socials do not exist, insert a new record
                    if (!user?.email) {
                        ErrorToast("An error occurred. Please try again later.");
                        return;
                    }
                    const { data, error } = await supaBase
                        .from("profile")
                        .insert([{ socials: filteredSocialData, email: user?.email }])
                        .eq("email", user?.email)
                        .select();

                    if (error) {
                        ErrorToast(error.message);
                        return;
                    }
                }

                SuccessToast("Social links updated successfully");
            } catch (error) {
                ErrorToast("An error occurred. Please try again later.");
            } finally {
                setShowPopup(false);
            }
        },
        [socials, user?.email],
    );

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfilePicEdit(e.target.files[0]);
        }
        // const url = URL.createObjectURL(imageData);
        //         setImage(url);
    };

    const handleCoverPicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCoverPicEdit(e.target.files[0]);
        }
    };

    const handlePictureUpload = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (profilePicEdit) {
                const profilePicName = `profile_${Date.now()}_${profilePicEdit.name}`;
                if (!profilePicName.includes("undefined")) {
                    const profilePicUrl = await uploadImageToStore(profilePicEdit, profilePicName);

                    const { data, error } = await supaBase
                        .from("profile")
                        .update({ profile_pic: profilePicUrl })
                        .eq("email", user?.email);

                    if (error) {
                        ErrorToast(error.message);
                    }

                    // Download profile pics
                    await downloadAndSetImage(profilePicUrl, "profile_pic", setProfilePicEdit);
                }
            }

            if (coverPicEdit) {
                const coverPicName = `cover_${Date.now()}_${coverPicEdit.name}`;
                if (!coverPicName.includes("undefined")) {
                    const coverPicUrl = await uploadImageToStore(coverPicEdit, coverPicName);

                    const { data, error } = await supaBase
                        .from("profile")
                        .update({ cover_pic: coverPicUrl })
                        .eq("email", user?.email);

                    if (error) {
                        ErrorToast(error.message);
                    }

                    // Download cover pics
                    await downloadAndSetImage(coverPicUrl, "cover_pic", setCoverPicEdit);
                }
            }

            SuccessToast("picture updated successfully");
            setShowEditImagePopup(false);
        },
        [coverPicEdit, downloadAndSetImage, profilePicEdit, uploadImageToStore, user?.email],
    );

    return {
        pageLoading,
        socials,
        showPopup,
        onEditSubmit,
        setShowPopup,
        handleSocialFormSubmit,
        profilePicEdit,
        coverPicEdit,
        showEditImagePopup,
        setShowEditImagePopup,
        handleProfilePicChange,
        handleCoverPicChange,
        handlePictureUpload,
    };
};
