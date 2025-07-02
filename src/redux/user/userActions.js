import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../baseUrl";

// Register
export const registerUser = createAsyncThunk("user/register", async ({ formdata, navigate }) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/api/auth/register`, formdata, {
      withCredentials: true
    });
    toast.success(data.message);
    navigate("/");
    return data;
  } catch (err) {
    const errorMsg = err?.response?.data?.message || "Register  failed";
    toast.error(errorMsg);

    // Pass error to rejected action
    return rejectWithValue(errorMsg);
  }

});

// Login
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password, navigate }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      toast.success(data.message);
      navigate("/");
      return data;
    } catch (error) {
      // Show error toast
      const errorMsg = error.response?.data?.message || "Login failed";
      toast.error(errorMsg);

      // Pass error to rejected action
      return rejectWithValue(errorMsg);
    }
  }
);

// Get Me
export const fetchUser = createAsyncThunk("user/fetch", async () => {
  const { data } = await axios.get(`${API_BASE_URL}/api/user/me`, {
    withCredentials: true
  });
  return data;
});

// Logout
export const logoutUser = createAsyncThunk("user/logout", async () => {
  const { data } = await axios.get(`${API_BASE_URL}/api/auth/logout`, {
    withCredentials: true
  });
  toast.success(data.message);
  return data;
});

// Follow
export const followUser = createAsyncThunk("user/follow", async ({ id, fetchUser }) => {
  const { data } = await axios.post(`${API_BASE_URL}/api/user/follow/${id}`, null, {
    withCredentials: true
  });
  toast.success(data.message);
  fetchUser();
  return data;
});

// Update Profile Pic
export const updateProfilePic = createAsyncThunk("user/updatePic", async ({ id, formdata, setFile, fetchUser }) => {
  const { data } = await axios.put(`${API_BASE_URL}/api/user/${id}`, formdata, {
    withCredentials: true
  });
  toast.success(data.message);
  return data;
});

// Update Name
export const updateProfileName = createAsyncThunk("user/updateName", async ({ id, name }) => {
  const { data } = await axios.put(`${API_BASE_URL}/api/user/${id}`, { name }, {
    withCredentials: true
  });
  toast.success(data.message);
  return data;
});

// Google OAuth Login
export const loginWithGoogle = () => async (dispatch) => {
  try {
    window.open(`${API_BASE_URL}/api/auth/google`, "_self");
  } catch (error) {
    console.error("Google Login Failed", error);
  }
};