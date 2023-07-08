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

export const fetchPostsToStore = createAsyncThunk("posts/fetchPosts", async () => {
    const { data, error } = await supaBase.from("posts").select("*");
    if (error) {
        throw error;
    }
    return data as PostType[];
});

interface PostsSliceType {
    posts: PostType[];
}

const initialState: PostsSliceType = {
    posts: [],
};

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
        deletePost: (state, action: PayloadAction<string>) => {
            const post_id = action.payload;
            const existingPost = state.posts?.find((post) => post?.post_id === post_id);
            if (existingPost) {
                state.posts.splice(state.posts.indexOf(existingPost), 1);
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
    extraReducers: (builder) => {
        builder.addCase(fetchPostsToStore.fulfilled, (state, action: PayloadAction<PostType[]>) => {
            const newPosts = action.payload.filter((newPost) => {
                // Check if the post already exists in the state
                return !state.posts?.some(
                    (existingPost) => existingPost.post_id === newPost.post_id,
                );
            });
            state.posts.push(...newPosts);
        });
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

export const selectPostsByAuthorId = createSelector(
    [selectPostsState, (_state: RootState, author_id: string) => author_id],
    (postsState: PostsSliceType, author_id: string) =>
        postsState.posts?.filter((post: PostType) => post.author_id === author_id),
);

export const selectPostsByStatus = createSelector(
    [selectPostsState, (_state: RootState, status: string) => status],
    (postsState: PostsSliceType, status: string) =>
        postsState.posts?.filter((post: PostType) => post.status === status),
);

export const { addPost, updatePost, deletePost, reactionCountAdded, reactionCountDeleted } =
    postsSlice.actions;

export default postsSlice.reducer;
