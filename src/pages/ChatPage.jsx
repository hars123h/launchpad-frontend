import React, { useEffect, useState } from "react";
import { ChatData } from "../context/ChatContext";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import Chat from "../components/chat/Chat";
import MessageContainer from "../components/chat/MessageContainer";
import { SocketData } from "../context/SocketContext";
import { useDispatch } from "react-redux";
import { API_BASE_URL } from "../baseUrl";
import PropTypes from "prop-types";

const ChatPage = ({ user }) => {
  const { createChat, selectedChat, setSelectedChat, chats, setChats } =
    ChatData();

  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState(false);

  async function fetchAllUsers() {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/user/all?search=` + query, {
        withCredentials: true,
      });
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }

  const getAllChats = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/messages/chats`, {
        withCredentials: true,
      });
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [query]);

  useEffect(() => {
    getAllChats();
  }, []);

  async function createNewChat(id) {
    createChat(id)
    setSearch(false);
    getAllChats();
  }

  const { onlineUsers } = SocketData();
  return (
    <div className="w-full px-2 md:p-4">
      <div className="flex flex-col md:flex-row gap-4 mx-auto w-full">
        {/* Left Sidebar */}
        <div className="w-full md:w-[30%] bg-white rounded-lg shadow-md md:h-[90vh]">
          <div className="p-4">
            {/* Toggle Search Button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Chats</h2>
              <button
                className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-3 py-1 rounded-full transition-all"
                onClick={() => setSearch(!search)}
              >
                {search ? "×" : <FaSearch />}
              </button>
            </div>

            {/* Search Mode */}
            {search ? (
              <>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="max-h-[70vh] overflow-y-auto space-y-2">
                  {users?.length > 0 ? (
                    users.map((e) => (
                      <button
                        key={e._id}
                        onClick={() => createNewChat(e._id)}
                        className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer transition"
                      >
                        <img
                          src={e.profilePic.url}
                          className="w-8 h-8 rounded-full"
                          alt={e.name}
                        />
                        <span className="text-gray-800 font-medium truncate">
                          {e.name}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No users found</p>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                {chats?.map((chat) => (
                  <Chat
                    key={chat._id}
                    chat={chat}
                    setSelectedChat={(chat) => dispatch(setSelectedChat(chat))}
                    isOnline={onlineUsers.includes(chat.users[0]._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Chat Window */}
        {selectedChat === null ? (
          <div className="w-full md:w-[70%] flex justify-center items-center text-center text-lg text-gray-700 h-[40vh] md:h-[90vh]">
            Hello 👋 {user.name}, select a chat to start conversation
          </div>
        ) : (
          <div className="w-full md:w-[70%] md:h-[90vh] h-[70vh]">
            <MessageContainer selectedChat={selectedChat} setChats={setChats} />
          </div>
        )}
      </div>
    </div>
  );
};

ChatPage.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default ChatPage;
