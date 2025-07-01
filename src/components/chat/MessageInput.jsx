import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateChatLatestMessage } from "../../redux/chat/chatSlice";

const MessageInput = ({ setMessages, selectedChat }) => {
  const [textMsg, setTextMsg] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/messages", {
        message: textMsg,
        recieverId: selectedChat.users[0]._id,
      });

      // Add the new message to local state
      setMessages((prev) => [...prev, data]);

      // Clear input field
      setTextMsg("");

      // Update latest message in Redux state
      dispatch(
        updateChatLatestMessage({
          chatId: selectedChat._id,
          message: data.text,
          sender: data.sender,
        })
      );
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <div>
      <form onSubmit={handleMessage} className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="Enter Message"
          className="border border-gray-300 rounded-lg p-2 w-[80%]"
          value={textMsg}
          onChange={(e) => setTextMsg(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 px-4 rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;