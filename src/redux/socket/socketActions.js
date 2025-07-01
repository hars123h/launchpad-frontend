import { io } from "socket.io-client";
import { setOnlineUsers, setSocket } from "./socketSlice";

const ENDPOINT = "http://localhost:7000";

export const connectSocket = (userId) => async (dispatch) => {
  const socket = io(ENDPOINT, {
    query: { userId },
  });

  socket.on("getOnlineUser", (users) => {
    dispatch(setOnlineUsers(users));
  });

  dispatch(setSocket(socket));
};

export const disconnectSocket = () => (dispatch, getState) => {
  const socket = getState().socket.socket;
  if (socket) {
    socket.disconnect();
    dispatch(setSocket(null));
    dispatch(setOnlineUsers([]));
  }
};