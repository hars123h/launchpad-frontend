import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { LoadingAnimation } from "../Loading";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { SocketData } from "../../context/SocketContext";

const MessageContainer = ({ selectedChat, setChats }) => {
  const [messages, setMessages] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const { socket } = SocketData();
  // const { socket, onlineUsers } = useSelector((state) => state.socket);



  const messageContainerRef = useRef(null);

  // Fetch messages from API
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/messages/${selectedChat.users[0]._id}`
      );
      setMessages(data);
    } catch (error) {
      console.log("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages when selectedChat changes
  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  // Scroll to latest message when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Listen to socket events
  useEffect(() => {
    const handleNewMessage = (message) => {
      if (selectedChat._id === message.chatId) {
        setMessages((prev) => [...prev, message]);
      }

      setChats((prev) =>
        prev.map((chat) =>
          chat._id === message.chatId
            ? {
              ...chat,
              latestMessage: {
                text: message.text,
                sender: message.sender,
              },
            }
            : chat
        )
      );
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedChat, setChats]);

  return (
    <div>
      {selectedChat && (
        <div className="flex flex-col">
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
                className="flex flex-col gap-4 my-4 h-[400px] overflow-y-auto border border-gray-300 bg-gray-100 p-3"
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

export default MessageContainer;