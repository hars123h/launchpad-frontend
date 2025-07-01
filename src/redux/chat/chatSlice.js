import { createSlice } from "@reduxjs/toolkit";
import { createChat } from "./chatActions";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    selectedChat: null,
  },
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    updateChatLatestMessage: (state, action) => {
      const { chatId, message, sender } = action.payload;
      state.chats = state.chats.map((chat) =>
        chat._id === chatId
          ? {
            ...chat,
            latestMessage: {
              text: message,
              sender,
            },
          }
          : chat
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createChat.rejected, (state, action) => {
      console.error("Failed to create chat:", action.error.message);
    });
  },
});
export const {
  setSelectedChat,
  setChats,
  updateChatLatestMessage, // <-- add this
} = chatSlice.actions;
export default chatSlice.reducer;