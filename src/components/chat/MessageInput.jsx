import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateChatLatestMessage } from "../../redux/chat/chatSlice";
import { API_BASE_URL } from "../../baseUrl";
import PropTypes from "prop-types";


const MessageInput = ({ setMessages, selectedChat }) => {
  const [textMsg, setTextMsg] = useState("");
  const dispatch = useDispatch();
  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/messages`,
        {
          message: textMsg,
          recieverId: selectedChat.users[0]._id,
        },
        {
          withCredentials: true,
        }
      );

      setMessages((prev) => [...prev, data]);
      setTextMsg("");

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
      <form onSubmit={handleMessage} className="flex justify-between gap-2 mt-2 z-[101]">
        <input
          type="text"
          placeholder="Enter Message"
          className="border border-gray-300 rounded-lg p-2 w-[90%]"
          value={textMsg}
          onChange={(e) => setTextMsg(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white p-2 px-4 w-[9%] rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

MessageInput.propTypes = {
  setMessages: PropTypes.func.isRequired,
  selectedChat: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string,
        profilePic: PropTypes.shape({
          url: PropTypes.string,
        }),
      })
    ).isRequired,
  }).isRequired,
};

export default MessageInput;