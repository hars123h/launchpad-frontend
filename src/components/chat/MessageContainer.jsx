import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { LoadingAnimation } from "../Loading";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { SocketData } from "../../context/SocketContext";
import { API_BASE_URL } from "../../baseUrl";
import PropTypes from "prop-types";

const MessageContainer = ({ selectedChat, setChats }) => {
  const [messages, setMessages] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const { socket } = SocketData();
  const messageContainerRef = useRef(null);
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/messages/${selectedChat.users[0]._id}`,
        {
          withCredentials: true,
        }
      );
      setMessages(data);
    } catch (error) {
      console.log("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    socket.on("newMessage", handleNewMessageWrapper);

    return () => socket.off("newMessage", handleNewMessageWrapper);
  }, [socket, selectedChat, setChats]);



  function handleNewMessageWrapper(message) {
    handleNewMessage(message, selectedChat, setMessages, setChats);
  }

  function handleNewMessage(message, selectedChat, setMessages, setChats) {
    if (selectedChat._id === message.chatId) {
      setMessages((prev) => [...prev, message]);
    }

    setChats((prev) => updateChatsWithNewMessage(prev, message));
  }

  function updateChatsWithNewMessage(chats, message) {
    return chats.map((chat) => {
      if (chat._id !== message.chatId) return chat;

      return {
        ...chat,
        latestMessage: {
          text: message.text,
          sender: message.sender,
        },
      };
    });
  }

  return (
    <div>
      {selectedChat && (
        <div className="flex flex-col min-[868px]:h-[90vh] h-[115vh]">
          {/* Chat Header */}
          <div className="flex w-full h-12 items-center gap-3">
            <img
              src={selectedChat.users[0].profilePic.url}
              className="w-8 h-8 rounded-full"
              alt="User"
            />
            <span>{selectedChat.users[0].name}</span>
          </div>

          {/* Chat Body */}
          {loading ? (
            <LoadingAnimation />
          ) : (
            <>
              <div
                ref={messageContainerRef}
                className="flex flex-col gap-4 my-4 h-[90vh] overflow-y-auto border border-gray-300 bg-gray-100 p-3"
              >
                {messages.map((e) => (
                  <Message
                    key={e._id}
                    message={e.text}
                    ownMessage={e.sender === user._id}
                  />
                ))}
              </div>

              {/* Message Input */}
              <MessageInput
                setMessages={setMessages}
                selectedChat={selectedChat}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
MessageContainer.propTypes = {
  selectedChat: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        profilePic: PropTypes.shape({
          url: PropTypes.string.isRequired,
        }).isRequired,
      })
    ).isRequired,
  }),
  setChats: PropTypes.func.isRequired,
};

export default MessageContainer;