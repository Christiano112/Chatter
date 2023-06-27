// import {
//     PayloadAction,
//     createSlice,
//     nanoid,
//     createAsyncThunk,
//     createSelector,
// } from "@reduxjs/toolkit";
// import { RootState } from "../redux/store";
// import { formatDateTimeShort } from "@/utils/date";

// interface PostType {
//     id: string;
//     title: string;
//     content: string;
//     date: string;
//     user?: string;
//     reactions?: {
//         [key: string]: number;
//     };
// }

// interface PostsSliceType {
//     posts: PostType[];
//     status: "idle" | "loading" | "success" | "failed";
//     error: string | undefined | null;
// }

// const initialState: PostsSliceType = {
//     posts: [],
//     status: "idle",
//     error: null,
// };

// const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
//     const response = await fetch("https://jsonplaceholder.typicode.com/posts");
//     return (await response.json()) as PostType[];
// });

// const fetchPostsByAuthorId = createAsyncThunk("posts/fetchPostsByAuthorId", async (userId: string) => {
//     const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
//     return (await response.json()) as PostType[];
// });

// const addNewPost = createAsyncThunk("posts/addNewPost", async (initialPost: PostType) => {
//     const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(initialPost),
//     });
//     return (await response.json()) as PostType;
// });

// const postsSlice = createSlice({
//     name: "posts",
//     initialState,
//     reducers: {
//         addPost: {
//             reducer(state, action: PayloadAction<PostType>) {
//                 state.posts.push(action.payload);
//             },
//             prepare(
//                 title: string,
//                 content: string,
//                 userId: string,
//             ): { payload: PostType; type: string } {
//                 const newPost: PostType = {
//                     id: nanoid(),
//                     title,
//                     content,
//                     date: formatDateTimeShort(new Date().toISOString()),
//                     user: userId,
//                     reactions: {
//                         like: 0,
//                         love: 0,
//                         haha: 0,
//                         wow: 0,
//                         sad: 0,
//                         angry: 0,
//                         thumbsUp: 0,
//                         thumbsDown: 0,
//                         fire: 0,
//                         clapping: 0,
//                     },
//                 };

//                 return {
//                     payload: newPost,
//                     type: "posts/addPost",
//                 };
//             },
//         },
//         updatePost: (state, action: PayloadAction<PostType>) => {
//             const { id, title, content } = action.payload;
//             const existingPost = state.posts.find((post) => post.id === id);
//             if (existingPost) {
//                 existingPost.title = title;
//                 existingPost.content = content;
//             }
//         },
//         deletePost: (state, action: PayloadAction<Pick<PostType, "id">>) => {
//             const { id } = action.payload;
//             const existingPost = state.posts.find((post) => post.id === id);
//             if (existingPost) {
//                 state.posts.splice(state.posts.indexOf(existingPost), 1);
//             }
//         },
//         reactionAdded: (state, action: PayloadAction<{ postId: string; reaction: string }>) => {
//             const { postId, reaction } = action.payload;
//             const existingPost = state.posts.find((post) => post.id === postId);
//             if (existingPost) {
//                 if (existingPost.reactions && existingPost.reactions[reaction]) {
//                     existingPost.reactions[reaction]++;
//                 } else {
//                     existingPost.reactions = {
//                         ...existingPost.reactions,
//                         [reaction]: 1,
//                     };
//                 }
//             }
//         },
//         reactionDeleted: (state, action: PayloadAction<{ postId: string; reaction: string }>) => {
//             const { postId, reaction } = action.payload;
//             const existingPost = state.posts.find((post) => post.id === postId);
//             if (existingPost) {
//                 if (existingPost.reactions && existingPost.reactions[reaction]) {
//                     existingPost.reactions[reaction]--;
//                 }
//             }
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchPosts.pending, (state) => {
//                 state.status = "loading";
//             })
//             .addCase(fetchPosts.fulfilled, (state, action) => {
//                 state.status = "success";
//                 state.posts = action.payload;
//             })
//             .addCase(fetchPosts.rejected, (state, action) => {
//                 state.status = "failed";
//                 state.error = action.error.message;
//             })
//             .addCase(fetchPostsByAuthorId.pending, (state) => {
//                 state.status = "loading";
//             })
//             .addCase(fetchPostsByAuthorId.fulfilled, (state, action) => {
//                 state.status = "success";
//                 state.posts = action.payload;
//             })
//             .addCase(fetchPostsByAuthorId.rejected, (state, action) => {
//                 state.status = "failed";
//                 state.error = action.error.message;
//             })
//             .addCase(addNewPost.pending, (state) => {
//                 state.status = "loading";
//             })
//             .addCase(addNewPost.fulfilled, (state, action) => {
//                 state.status = "success";
//                 state.posts.push(action.payload);
//             })
//             .addCase(addNewPost.rejected, (state, action) => {
//                 state.status = "failed";
//                 state.error = action.error.message;
//             });
//     },
// });

// const selectPostsState = (state: RootState) => state.posts;

// // export const selectAllPosts = createSelector(
// //     selectPostsState,
// //     (postsState: PostsSliceType) => postsState.posts
// // );

// // export const selectPostById = createSelector(
// //     [selectPostsState, (state: RootState, postId: string) => postId],
// //     (postsState: PostsSliceType, postId: string) =>
// //         postsState.posts.find((post: PostType) => post.id === postId)
// // );

// // export const selectPostStatus = createSelector(
// //     selectPostsState,
// //     (postsState: PostsSliceType) => postsState.status
// // );

// // export const selectPostError = createSelector(
// //     selectPostsState,
// //     (postsState: PostsSliceType) => postsState.error
// // );

// const { addPost, updatePost, deletePost, reactionAdded, reactionDeleted } = postsSlice.actions;

// // export default postsSlice.reducer;
