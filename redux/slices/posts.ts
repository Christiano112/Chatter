"use client";

import { PayloadAction, createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { formatDateTimeShort } from "@/utils/date";
import supaBase from "@/utils/supabase";

export interface PostType {
    post_id: string;
    title: string;
    content: string;
    created_at?: any;
    author_id: string;
    reactions?: {
        [key: string]: number;
    };
    status?: "draft" | "published" | "deleted" | "archived" | "edited";
}

interface PostsSliceType {
    posts: PostType[];
}

const initialState: PostsSliceType = {
    posts: [],
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
    let { data: posts, error } = await supaBase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) throw error;
    return posts as PostType[];
});

export const fetchPostsByAuthorId = createAsyncThunk(
    "posts/fetchPostsByAuthorId",
    async (author_id: string) => {
        let { data: posts, error } = await supaBase
            .from("posts")
            .select("*")
            .eq("author_id", author_id)
            .order("created_at", { ascending: false });
        if (error) throw error;
        return posts as PostType[];
    },
);

// export const addNewPost = createAsyncThunk("posts/addPost", async (initialPost: PostType) => {
//     const { data: post, error } = await supaBase.from("posts").insert(initialPost).single();
//     if (error) throw error;
//     return post as PostType;
// });

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        addPost: {
            reducer(state, action: PayloadAction<PostType>) {
                state.posts?.push(action.payload);
            },
            prepare(
                author_id: string,
                title: string,
                content: string,
                post_id: string,
                status?: "draft" | "published" | "deleted" | "archived" | "edited",
                reactions?: any,
            ): { payload: PostType; type: string } {
                const newPost: PostType = {
                    author_id,
                    title,
                    content,
                    created_at: formatDateTimeShort(new Date().toISOString()),
                    post_id,
                    status: status ?? "draft",
                    reactions: reactions ?? {
                        like: 0,
                        love: 0,
                        haha: 0,
                        thumbsDown: 0,
                    },
                };

                return {
                    payload: newPost,
                    type: "posts/addPost",
                };
            },
        },
        updatePost: (state, action: PayloadAction<PostType>) => {
            const { post_id, title, content } = action.payload;
            const existingPost = state.posts?.find((post) => post?.post_id === post_id);
            if (existingPost) {
                existingPost.title = title;
                existingPost.content = content;
            }
        },
        // deletePost: (state, action: PayloadAction<string>) => {
        //     const post_id = action.payload;
        //     const existingPost = state.posts?.find((post) => post?.post_id === post_id);
        //     if (existingPost) {
        //         state.posts.splice(state.posts.indexOf(existingPost), 1);
        //     }
        // },
        deletePost: (state, action: PayloadAction<string>) => {
            const post_id = action.payload;
            const index = state.posts.findIndex((post) => post.post_id === post_id);
            if (index !== -1) {
                state.posts.splice(index, 1);
            }
        },
        reactionCountAdded(state, action: PayloadAction<{ post_id: string; reaction: string }>) {
            const { post_id, reaction } = action.payload;
            const existingPost = state.posts?.find((post) => post?.post_id === post_id);
            if (existingPost) {
                if (existingPost.reactions && existingPost.reactions[reaction]) {
                    existingPost.reactions[reaction]++;
                } else {
                    existingPost.reactions = {
                        ...existingPost.reactions,
                        [reaction]: 1,
                    };
                }
            }
        },
        reactionCountDeleted(state, action: PayloadAction<{ post_id: string; reaction: string }>) {
            const { post_id, reaction } = action.payload;
            const existingPost = state.posts?.find((post) => post?.post_id === post_id);
            if (existingPost) {
                if (existingPost.reactions && existingPost.reactions[reaction]) {
                    existingPost.reactions[reaction]--;
                }
            }
        },
    },
});

const selectPostsState = (state: RootState) => state.posts;

export const selectAllPosts = createSelector(
    selectPostsState,
    (postsState: PostsSliceType) => postsState.posts,
);

export const selectPostById = createSelector(
    [selectPostsState, (_state: RootState, post_id: string) => post_id],
    (postsState: PostsSliceType, post_id: string) =>
        postsState.posts?.find((post: PostType) => post.post_id === post_id),
);

export const selectPostsByStatus = createSelector(
    [selectPostsState, (_state: RootState, status: string) => status],
    (postsState: PostsSliceType, status: string) =>
        postsState.posts?.filter((post: PostType) => post.status === status),
);

// export const selectAllPosts = (state: RootState) => state.posts.posts;

// export const selectPostById = createSelector(
//     [selectAllPosts, (_state: RootState, post_id: string) => post_id],
//     (posts, post_id) => posts?.find((post) => post?.post_id === post_id),
// );

// export const selectPostsByStatus = createSelector(
//     [selectAllPosts, (_state: RootState, status: string) => status],
//     (posts, status) => posts?.filter((post) => post?.status === status),
// );

export const { addPost, updatePost, deletePost, reactionCountAdded, reactionCountDeleted } =
    postsSlice.actions;

export default postsSlice.reducer;
