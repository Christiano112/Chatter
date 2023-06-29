"use client";

import {
    PayloadAction,
    createSlice,
    createAsyncThunk,
    createSelector,
    createEntityAdapter,
    EntityState,
} from "@reduxjs/toolkit";
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
    status?: "draft" | "published" | "deleted" | "archived" | "edited" | "";
}

export interface PostsSliceType extends EntityState<PostType> {
    fetchStatus: "idle" | "loading" | "success" | "failed";
    fetchError: string | undefined | null;
}

const postsAdapter = createEntityAdapter<PostType>({
    sortComparer: (a, b) => b.created_at?.localeCompare(a.created_at),
});

const initialState: PostsSliceType = postsAdapter.getInitialState({
    fetchStatus: "idle",
    fetchError: null,
});

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

export const addNewPost = createAsyncThunk("posts/addPost", async (initialPost: PostType) => {
    const { data: post, error } = await supaBase.from("posts").insert(initialPost).single();
    if (error) throw error;
    return post as PostType;
});

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        addPost: {
            reducer(state, action: PayloadAction<PostType>) {
                postsAdapter.addOne(state, action.payload);
            },
            prepare(
                author_id: string,
                title: string,
                content: string,
                post_id: string,
                status?: "draft" | "published" | "deleted" | "archived" | "edited" | "",
                created_at?: any,
            ): { payload: PostType; type: string } {
                const newPost: PostType = {
                    author_id,
                    title,
                    content,
                    created_at: created_at ?? formatDateTimeShort(new Date().toISOString()),
                    post_id,
                    status,
                    reactions: {
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
        updatePost: postsAdapter.updateOne,
        deletePost: postsAdapter.removeOne,
        reactionAdded(state, action: PayloadAction<{ post_id: string; reaction: string }>) {
            const { post_id, reaction } = action.payload;
            const existingPost = state.entities[post_id];
            if (existingPost && existingPost.reactions && existingPost.reactions[reaction]) {
                existingPost.reactions[reaction] += 1;
            }
        },
        reactionDeleted(state, action: PayloadAction<{ post_id: string; reaction: string }>) {
            const { post_id, reaction } = action.payload;
            const existingPost = state.entities[post_id];
            if (existingPost && existingPost.reactions && existingPost.reactions[reaction]) {
                existingPost.reactions[reaction] -= 1;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.fetchStatus = "success";
                postsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.fetchError = action.error.message;
            })
            .addCase(fetchPostsByAuthorId.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(fetchPostsByAuthorId.fulfilled, (state, action) => {
                state.fetchStatus = "success";
                postsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchPostsByAuthorId.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.fetchError = action.error.message;
            })
            .addCase(addNewPost.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                state.fetchStatus = "success";
                postsAdapter.addOne(state, action.payload);
            })
            .addCase(addNewPost.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.fetchError = action.error.message;
            });
    },
});

const selectPostsState = (state: RootState) => state.posts;

export const { selectAll: selectAllPosts } = postsAdapter.getSelectors<RootState>(selectPostsState);

export const selectPostById = createSelector(
    [selectAllPosts, (state: RootState, post_id: string) => post_id],
    (posts, post_id) => posts?.find((post) => post?.post_id === post_id),
);

export const selectPostsByAuthor = createSelector(
    [selectAllPosts, (state: RootState, user_id: string) => user_id],
    (posts, user_id) => posts?.filter((post) => post?.author_id === user_id),
);

export const selectPostFetchStatus = createSelector(
    selectPostsState,
    (postsState: PostsSliceType) => postsState.fetchStatus,
);

export const { addPost, updatePost, deletePost, reactionAdded, reactionDeleted } =
    postsSlice.actions;

export default postsSlice.reducer;
