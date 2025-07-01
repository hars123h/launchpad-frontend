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

    // dispatch(
    //   addPost({
    //     formdata,type,
    //   })
    // );
    const result = await dispatch(addPost({ formdata, type }));

    if (addPost.fulfilled.match(result)) {
      dispatch(fetchPosts()); // Optionally refetch posts
      setFile(null);
      setFilePrev("");
      setCaption("");
      if (fileInputRef?.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center pt-3 pb-5">
      <div className="bg-white p-8 rounded-lg shadow-md w-md min-[768px]:w-[60%]">
        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-4 items-center justify-between mb-4"
        >
          <input
            type="text"
            className="custom-input"
            placeholder="Enter Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <input
            ref={fileInputRef}
            type="file"
            className="custom-input"
            accept={type === "post" ? "image/*" : "video/*"}
            onChange={changeFileHandler}
            required
          />
          {filePrev && (
            <>
              {type === "post" ? (
                <img src={filePrev} alt="" />
              ) : (
                <video
                  controlsList="nodownload"
                  controls
                  src={filePrev}
                  className="h-[450px] w-[300px]"
                />
              )}
            </>
          )}
          <button
            disabled={addLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            {addLoading ? <LoadingAnimation /> : "+ Add Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;