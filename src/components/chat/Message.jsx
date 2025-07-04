import React from "react";
import PropTypes from "prop-types";


const Message = ({ ownMessage, message }) => {
  return (
    <div className={`mb-2 ${ownMessage ? "text-right" : "text-left"}`}>
      <span
        className={`inline-block p-2 rounded-lg ${ownMessage ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white" : "bg-white text-black"
          }`}
      >
        {message}
      </span>
    </div>
  );
};
Message.propTypes = {
  ownMessage: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
};
export default Message;
