import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../baseUrl";

// Create new chat (send first message)
export const createChat = createAsyncThunk("chat/create", async (id) => {
  const { data } = await axios.post(`${API_BASE_URL}/api/messages`, {
    recieverId: id,
    message: "hii",
  });
  return data;
});