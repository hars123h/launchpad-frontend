import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import postReducer from "./post/postSlice";
import chatReducer from "./chat/chatSlice";
import socketReducer from "./socket/socketSlice"
// import { thunk } from 'redux-thunk';


const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    chat: chatReducer,
    socket: socketReducer,
  },
  
});

export default store;