import React from "react";
import { useSelector } from "react-redux";
import { BsSendCheck } from "react-icons/bs";

const Chat = ({ chat, setSelectedChat, isOnline }) => {
  const { user: loggedInUser } = useSelector((state) => state.user);
  let user;

  if (chat) {
    user = chat.users.find((u) => u._id !== loggedInUser._id);
  }

  return (
    <div>
      {user && (
        <div
          className="bg-white hover:bg-gray-100 transition-all duration-200 px-4 py-3 rounded-lg shadow-sm cursor-pointer mt-3 h-20 flex items-center gap-3"
          onClick={() => setSelectedChat(chat)}
        >
          {/* Avatar */}
          <div className="relative">
            <img
              src={user.profilePic.url}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>

          {/* Name + Message */}
          <div className="flex flex-col justify-center w-full overflow-hidden">
            <span className="font-medium text-gray-800 truncate">{user.name}</span>
            <span className="text-sm text-gray-600 flex items-center gap-1 truncate">
              {loggedInUser._id === chat.latestMessage?.sender && (
                <BsSendCheck className="text-blue-500" />
              )}
              {chat.latestMessage?.text
                ? chat.latestMessage.text.length > 30
                  ? chat.latestMessage.text.slice(0, 30) + "..."
                  : chat.latestMessage.text
                : "No messages yet"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;