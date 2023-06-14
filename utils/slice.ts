import {
    PayloadAction,
    createSlice,
    nanoid,
    createAsyncThunk,
    createSelector,
    createEntityAdapter,
    EntityState,
    EntityId,
} from "@reduxjs/toolkit";
import { RootState } from "../redux/store";
import { formatDateTimeShort } from "@/utils/date";

export interface PostType {
    id: EntityId;
    title: string;
    content: string;
    date: string;
    user?: string;
    reactions?: {
        [key: string]: number;
    };
}

export interface PostsSliceType extends EntityState<PostType> {
    status: "idle" | "loading" | "success" | "failed";
    error: string | undefined | null;
}

const postsAdapter = createEntityAdapter<PostType>({
    sortComparer: (a, b) => b.date?.localeCompare(a.date),
});

const initialState: PostsSliceType = postsAdapter.getInitialState({
    status: "idle",
    error: null,
});

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    return (await response.json()) as PostType[];
});

export const fetchPostsByUserId = createAsyncThunk(
    "posts/fetchPostsByUserId",
    async (userId: string) => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        return (await response.json()) as PostType[];
    },
);

export const addNewPost = createAsyncThunk("posts/addNewPost", async (initialPost: PostType) => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(initialPost),
    });
    return (await response.json()) as PostType;
});

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        // addPost: {
        //     reducer(state, action: PayloadAction<PostType>) {
        //         postsAdapter.addOne(state, action.payload);
        //     },
        //     prepare(title: string, content: string, userId: string): { payload: PostType; type: string } {
        //         const newPost: PostType = {
        //             id: nanoid(),
        //             title,
        //             content,
        //             date: formatDateTimeShort(new Date().toISOString()),
        //             user: userId,
        //             reactions: {
        //                 like: 0,
        //                 love: 0,
        //                 haha: 0,
        //                 wow: 0,
        //                 sad: 0,
        //                 angry: 0,
        //                 thumbsUp: 0,
        //                 thumbsDown: 0,
        //                 fire: 0,
        //                 clapping: 0,
        //             },
        //         };

        //         return {
        //             payload: newPost,
        //             type: 'posts/addPost',
        //         };
        //     },
        // },
        addPost: postsAdapter.addOne,
        updatePost: postsAdapter.updateOne,
        deletePost: postsAdapter.removeOne,
        reactionAdded(state, action: PayloadAction<{ postId: EntityId; reaction: string }>) {
            const { postId, reaction } = action.payload;
            const existingPost = state.entities[postId];
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
        reactionDeleted(state, action: PayloadAction<{ postId: EntityId; reaction: string }>) {
            const { postId, reaction } = action.payload;
            const existingPost = state.entities[postId];
            if (existingPost) {
                if (existingPost.reactions && existingPost.reactions[reaction]) {
                    existingPost.reactions[reaction]--;
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "success";
                postsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(fetchPostsByUserId.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPostsByUserId.fulfilled, (state, action) => {
                state.status = "success";
                postsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchPostsByUserId.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(addNewPost.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                state.status = "success";
                postsAdapter.addOne(state, action.payload);
            })
            .addCase(addNewPost.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

const selectPostsState = (state: RootState) => state.posts;

export const { selectAll: selectAllPosts, selectById: selectPostById } =
    postsAdapter.getSelectors<RootState>(selectPostsState);

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state: RootState, userId: string) => userId],
    (posts, userId) => posts.filter((post) => post.user === userId),
);

export const selectPostStatus = createSelector(
    selectPostsState,
    (postsState: PostsSliceType) => postsState.status,
);

export const selectPostError = createSelector(
    selectPostsState,
    (postsState: PostsSliceType) => postsState.error,
);

export const { addPost, updatePost, deletePost, reactionAdded, reactionDeleted } =
    postsSlice.actions;

export default postsSlice.reducer;
