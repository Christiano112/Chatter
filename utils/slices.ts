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
// }

// const initialState: PostsSliceType = {
//     posts: [],
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
//         reactionCountAdded: (state, action: PayloadAction<{ postId: string; reaction: string }>) => {
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
//         reactionCountDeleted: (state, action: PayloadAction<{ postId: string; reaction: string }>) => {
//             const { postId, reaction } = action.payload;
//             const existingPost = state.posts.find((post) => post.id === postId);
//             if (existingPost) {
//                 if (existingPost.reactions && existingPost.reactions[reaction]) {
//                     existingPost.reactions[reaction]--;
//                 }
//             }
//         },
//     },
// });

// const selectPostsState = (state: RootState) => state.posts;

// export const selectAllPosts = createSelector(
//     selectPostsState,
//     (postsState: PostsSliceType) => postsState.posts
// );

// export const selectPostById = createSelector(
//     [selectPostsState, (state: RootState, postId: string) => postId],
//     (postsState: PostsSliceType, postId: string) =>
//         postsState.posts.find((post: PostType) => post.id === postId)
// );

// const { addPost, updatePost, deletePost, reactionCountAdded, reactionCountDeleted } = postsSlice.actions;

// export default postsSlice.reducer;
