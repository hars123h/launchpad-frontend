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
    nextCursor: null,
    hasMore: true,
    postsCursor: null,
    reelsCursor: null,
    hasMorePosts: true,
    hasMoreReels: true,
    loading: false,
    fetchLoading: false,
    addLoading: false,
    // hasMore: true,

  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        const isPaginated = Boolean(action.meta?.arg?.cursor);

        if (isPaginated) {
          // Append for pagination
          state.posts = [...state.posts, ...action.payload.posts];
        } else {
          // Fresh initial load (cursor = null or undefined)
          state.posts = action.payload.posts;
        }
        state.reels = action.payload.reels;
        state.nextCursor = action.payload.nextCursor;
        state.hasMore = action.payload.hasMore;
        state.fetchLoading = false;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.fetchLoading = false;
      })

      // .addCase(fetchPosts.pending, (state) => {
      //   state.fetchLoading = true;
      // })
      // .addCase(fetchPosts.fulfilled, (state, action) => {
      //   state.posts = action.payload.posts;
      //   state.reels = action.payload.reels;
      //   state.fetchLoading = false;
      // })
      // .addCase(fetchPosts.rejected, (state) => {
      //   state.fetchLoading = false;
      // })
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
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const list = updatedPost.type === "reel" ? state.reels : state.posts;
        const index = list.findIndex((p) => p._id === updatedPost._id);
        console.log("Index", index);
        if (index !== -1) {
          list[index] = updatedPost; // Replace with updated post
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const list = updatedPost.type === "reel" ? state.reels : state.posts;

        const index = list.findIndex((p) => p._id === updatedPost._id);
        if (index !== -1) {
          list[index] = updatedPost;
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const list = updatedPost.type === "reel" ? state.reels : state.posts;
        const index = list.findIndex((p) => p._id === updatedPost._id);
        if (index !== -1) {
          list[index] = updatedPost;
        }
      });
  }
});

export default postSlice.reducer;