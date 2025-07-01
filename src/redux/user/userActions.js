import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

// Register
export const registerUser = createAsyncThunk("user/register", async ({ formdata, navigate }) => {
  const { data } = await axios.post("/api/auth/register", formdata);
  toast.success(data.message);
  // fetchPosts();
  navigate("/");
  return data;
});

// Login
export const loginUser = createAsyncThunk("user/login", async ({ email, password, navigate }) => {
  const { data } = await axios.post("/api/auth/login", { email, password });
  toast.success(data.message);
  // fetchPosts();
  navigate("/");
  // console.log("Dataaaa", data)

  return data;
});

// Get Me
export const fetchUser = createAsyncThunk("user/fetch", async () => {
  const { data } = await axios.get("/api/user/me");
  return data;
});

// Logout
export const logoutUser = createAsyncThunk("user/logout", async () => {
  const { data } = await axios.get("/api/auth/logout");
  toast.success(data.message);
  // navigate("/login");

  return data;
});

// Follow
export const followUser = createAsyncThunk("user/follow", async ({ id, fetchUser }) => {
  const { data } = await axios.post("/api/user/follow/" + id);
  toast.success(data.message);
  fetchUser();
  return data;
});

// Update Profile Pic
export const updateProfilePic = createAsyncThunk("user/updatePic", async ({ id, formdata, setFile, fetchUser }) => {
  const { data } = await axios.put("/api/user/" + id, formdata);
  toast.success(data.message);
  // fetchUser();
  // setFile(null);
  return data;
});

// Update Name
export const updateProfileName = createAsyncThunk("user/updateName", async ({ id, name }) => {
  const { data } = await axios.put("/api/user/" + id, { name });
  toast.success(data.message);
  // fetchUser();
  // setShowInput(false);
  return data;
});

export const loginWithGoogle = () => async (dispatch) => {
  try {
    // Open Google OAuth in the same tab or popup
    window.open("http://localhost:7000/api/auth/google", "_self");
  } catch (error) {
    console.error("Google Login Failed", error);
  }
};