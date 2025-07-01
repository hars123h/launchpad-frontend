import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

// Create new chat (send first message)
export const createChat = createAsyncThunk("chat/create", async (id) => {
  const { data } = await axios.post("/api/messages", {
    recieverId: id,
    message: "hii",
  });
  return data;
});