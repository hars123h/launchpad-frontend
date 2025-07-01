import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../baseUrl";

// Fetch all posts
export const fetchPosts = createAsyncThunk("post/fetchAll", async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/post/all`);

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
        const { data } = await axios.post(`${API_BASE_URL}/api/post/new?type=` + type, formdata);
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
export const likePost = createAsyncThunk(`${API_BASE_URL}/post/like`, async (id) => {
    const { data } = await axios.post("/api/post/like/" + id);
    toast.success(data.message);
    // dispatch(fetchPosts());
    return data;
});

// Add comment
export const addComment = createAsyncThunk(
    "post/addComment",
    async ({ id, comment }) => {
        const { data } = await axios.post(`${API_BASE_URL}/api/post/comment/` + id, { comment });
        toast.success(data.message);
        // dispatch(fetchPosts());
        // setComment("");
        // setShow(false);
        return data;
    }
);

// Delete post
export const deletePost = createAsyncThunk(`${API_BASE_URL}/post/delete`, async (id) => {
    const { data } = await axios.delete("/api/post/" + id);
    toast.success(data.message);
    // dispatch(fetchPosts());
    return data;
});

// Delete comment
export const deleteComment = createAsyncThunk(
    "post/deleteComment",
    async ({ id, commentId }) => {
        const { data } = await axios.delete(`${API_BASE_URL}/api/post/comment/${id}?commentId=${commentId}`);
        toast.success(data.message);
        // dispatch(fetchPosts());
        return data;
    }
);