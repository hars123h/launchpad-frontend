import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingAnimation } from "./Loading";
import { addPost, fetchPosts } from "../redux/post/postActions.js";

const AddPost = ({ type }) => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [filePrev, setFilePrev] = useState("");
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const { addLoading } = useSelector((state) => state.post);

  const changeFileHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setFilePrev(reader.result);
      setFile(file);
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("caption", caption);
    formdata.append("file", file);

    const result = await dispatch(addPost({ formdata, type }));

    if (addPost.fulfilled.match(result)) {
      dispatch(fetchPosts());
      setFile(null);
      setFilePrev("");
      setCaption("");
      if (fileInputRef?.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 py-8">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-3xl">
        <h2 className="text-2xl  text-violet-500 font-bold from-indigo-500 to-violet-500 mb-4 text-center">
          ✨ Share Your Moment
          {/* {type === "post" ? "Post" : "Reel"} */}
        </h2>

        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <textarea
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none w-full"
            placeholder="Enter Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3} // adjust the number of visible rows
          ></textarea>

          <label className="block">
            <span className="text-gray-700 font-medium">Choose {type === "post" ? "Image" : "Video"}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept={type === "post" ? "image/*" : "video/*"}
              onChange={changeFileHandler}
              required
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0 file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </label>

          {filePrev && (
            <div className="flex justify-center items-center mt-4">
              {type === "post" ? (
                <img
                  src={filePrev}
                  alt="Preview"
                  className="w-64 h-64 object-cover rounded-lg border border-gray-300"
                />
              ) : (
                <video
                  src={filePrev}
                  controls
                  controlsList="nodownload"
                  className="w-64 h-64 rounded-lg border border-gray-300"
                />
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={addLoading}
            className={`-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-none rounded-[15px] text-base font-semibold cursor-pointer transition-all  hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(99,102,241,0.4)]transition duration-200 ${addLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {addLoading ? <LoadingAnimation /> : "🚀 Share  Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;