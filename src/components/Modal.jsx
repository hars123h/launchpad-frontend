import React from "react";
import { Link } from "react-router-dom";

const Modal = ({ value, title, setShow }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto p-6 relative">
        {/* Close Button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-500 transition"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">
          {title}
        </h2>

        {/* List */}
        <div className="flex flex-col gap-3">
          {value && value.length > 0 ? (
            value.map((e, i) => (
              <Link
                to={`/user/${e._id}`}
                key={i}
                onClick={() => setShow(false)}
                className="flex items-center gap-3 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
              >
                <span className="text-sm text-gray-700 font-medium">{i + 1}.</span>
                <img
                  src={e.profilePic.url}
                  alt={e.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-gray-800 font-medium">{e.name}</span>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center">No {title} yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;