import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

// Fetch all posts
export const fetchPosts = createAsyncThunk("post/fetchAll", async () => {
    const { data } = await axios.get("/api/post/all");

    console.log("Data", data);

    return data; // { posts: [...], reels: [...] }
});


// export const fetchPosts = createAsyncThunk(
//     "post/fetchAll",
//     async ({ type = "post", limit , cursor = null }, { rejectWithValue }) => {
//         try {
//             const url = `/api/post/all?type=${type}&limit=${limit}${cursor ? `&cursor=${cursor}` : ""}`;
//             const { data } = await axios.get(url);

//             return {
//                 type,
//                 posts: type === "post" ? data.posts : data.reels,
//                 nextCursor: type === "post" ? data.nextPostCursor : data.nextReelCursor,
//                 hasMore: type === "post" ? data.hasMorePosts : data.hasMoreReels
//             };
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || "Failed to fetch posts");
//         }
//     }
// );

// Add a new post
export const addPost = createAsyncThunk(
    "post/add",
    async ({ formdata, type }, { dispatch }) => {
        const { data } = await axios.post("/api/post/new?type=" + type, formdata);
        toast.success(data.message);
        // dispatch(fetchPosts());
        // setFile(null);
        // setFilePrev("");
        // setCaption("");
        // if (fileInputRef?.current) fileInputRef.current.value = "";
        return data;
    }
);

// Like post
export const likePost = createAsyncThunk("post/like", async (id) => {
    const { data } = await axios.post("/api/post/like/" + id);
    toast.success(data.message);
    // dispatch(fetchPosts());
    return data;
});

// Add comment
export const addComment = createAsyncThunk(
    "post/addComment",
    async ({ id, comment }) => {
        const { data } = await axios.post("/api/post/comment/" + id, { comment });
        toast.success(data.message);
        // dispatch(fetchPosts());
        // setComment("");
        // setShow(false);
        return data;
    }
);

// Delete post
export const deletePost = createAsyncThunk("post/delete", async (id) => {
    const { data } = await axios.delete("/api/post/" + id);
    toast.success(data.message);
    // dispatch(fetchPosts());
    return data;
});

// Delete comment
export const deleteComment = createAsyncThunk(
    "post/deleteComment",
    async ({ id, commentId }) => {
        const { data } = await axios.delete(`/api/post/comment/${id}?commentId=${commentId}`);
        toast.success(data.message);
        // dispatch(fetchPosts());
        return data;
    }
);