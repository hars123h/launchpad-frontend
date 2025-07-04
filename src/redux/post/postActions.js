import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../baseUrl";

// Fetch all posts
// export const fetchPosts = createAsyncThunk("post/fetchAll", async () => {
//     const { data } = await axios.get(`${API_BASE_URL}/api/post/all`, {
//         withCredentials: true,
//     });

//     console.log("Data", data);
//     return data;
// });

export const fetchPosts = createAsyncThunk("post/fetchAll", async ({ cursor, limit = 5 }) => {
    const { data } = await axios.get(
        `${API_BASE_URL}/api/post/all`,
        {
            params: { cursor, limit, type: "post" },
            withCredentials: true,
        }
    );

    return data;
});

// Add a new post
export const addPost = createAsyncThunk(
    "post/add",
    async ({ formdata, type }) => {
        const { data } = await axios.post(
            `${API_BASE_URL}/api/post/new?type=` + type,
            formdata,
            {
                withCredentials: true,
            }
        );
        toast.success(data.message);
        return data;
    }
);


export const likePost = createAsyncThunk("post/like", async (id) => {
    const { data } = await axios.post(
        `${API_BASE_URL}/api/post/like/${id}`,
        null,
        {
            withCredentials: true,
        }
    );
    
    console.log("like/Unlike", data)
    return data.post;
});

// Add comment
export const addComment = createAsyncThunk(
    "post/addComment",
    async ({ id, comment }) => {
        const { data } = await axios.post(
            `${API_BASE_URL}/api/post/comment/${id}`,
            { comment },
            {
                withCredentials: true,
            }
        );
        toast.success("Comment Added");
        return data;
    }
);


export const deletePost = createAsyncThunk("post/delete", async (id) => {
    const { data } = await axios.delete(`${API_BASE_URL}/api/post/${id}`, {
        withCredentials: true,
    });
    toast.success(data.message);
    return data;
});


export const deleteComment = createAsyncThunk(
    "post/deleteComment",
    async ({ id, commentId }) => {
        const { data } = await axios.delete(
            `${API_BASE_URL}/api/post/comment/${id}?commentId=${commentId}`,
            {
                withCredentials: true,
            }
        );
        toast.success("Comment Deleted");
        return data;
    }
);