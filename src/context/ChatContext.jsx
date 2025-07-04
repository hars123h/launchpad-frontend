import axios from "axios";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../baseUrl";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  async function createChat(id) {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/messages`,
        {
          recieverId: id, // ✅ spelling fixed
          message: "hii",
        },
        {
          withCredentials: true, // ✅ correct placement
        }
      );

      // Optional: update chat state if needed
      // setChats((prev) => [...prev, data.chat]);

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create chat");
      console.error(error);
    }
  }

  return (
    <ChatContext.Provider
      value={{ createChat, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatData = () => useContext(ChatContext);