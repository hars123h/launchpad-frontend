import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPosts,
  addPost,
  likePost,
  addComment,
  deletePost,
  deleteComment,
} from "./postActions.js";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    reels: [],
    postsCursor: null,
    reelsCursor: null,
    hasMorePosts: true,
    hasMoreReels: true,
    loading: false,
    fetchLoading: false,
    addLoading: false,
    hasMore: true,

  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload.posts;
        state.reels = action.payload.reels;
        state.fetchLoading = false;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.fetchLoading = false;
      })
      // .addCase(fetchPosts.pending, (state) => {
      //   state.fetchLoading = true;
      // })
      // .addCase(fetchPosts.fulfilled, (state, action) => {
      //   const { type, posts, nextCursor, hasMore } = action.payload;

      //   if (type === "post") {
      //     state.posts = [...state.posts, ...posts];
      //     state.postsCursor = nextCursor;
      //     state.hasMorePosts = hasMore;
      //   } else if (type === "reel") {
      //     state.reels = [...state.reels, ...posts];
      //     state.reelsCursor = nextCursor;
      //     state.hasMoreReels = hasMore;
      //   }

      //   state.fetchLoading = false;
      // })
      // .addCase(fetchPosts.rejected, (state) => {
      //   state.fetchLoading = false;
      // })
      .addCase(addPost.pending, (state) => {
        state.addLoading = true;
      })
      .addCase(addPost.fulfilled, (state) => {
        state.addLoading = false;
      })
      .addCase(addPost.rejected, (state) => {
        state.addLoading = false;
      });
  }
});

export default postSlice.reducer;