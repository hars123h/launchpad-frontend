import React, { useEffect, useState } from "react";
import { BsChatFill, BsThreeDotsVertical } from "react-icons/bs";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
// import { UserData } from "../context/UserContext";
// import { PostData } from "../context/PostContext";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import SimpleModal from "./SimpleModal";
import { LoadingAnimation } from "./Loading";
import toast from "react-hot-toast";
import axios from "axios";
import LikeModal from "./LikeModal";
import { SocketData } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
// import { deleteComment } from "../redux/post/postSlice";

import { addComment, deleteComment, deletePost, fetchPosts, likePost } from "../redux/post/postActions.js";
import { API_BASE_URL } from "../baseUrl.js";


const PostCard = ({ type, value }) => {
  const [isLike, setIsLike] = useState(false);
  const [show, setShow] = useState(false);
  // const { user } = UserData();
  // const { likePost, addComment, deletePost, loading, fetchPosts } = PostData();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.post);

  const formatDate = format(new Date(value.createdAt), "MMMM do");

  useEffect(() => {
    for (let i = 0; i < value.likes.length; i++) {
      if (value.likes[i] === user._id) setIsLike(true);
    }
  }, [value, user._id]);

  // const likeHandler = async () => {
  //   setIsLike((prev) => !prev); // Optimistic UI update

  //   const result = await dispatch(likePost(value._id));

  //   if (likePost.fulfilled.match(result)) {
  //     // ✅ You don't need to call fetchPosts here!
  //     // Just update post.likes in reducer OR update isLike locally.
  //   } else {
  //     // Revert optimistic update on failure
  //     setIsLike((prev) => !prev);
  //   }
  // };


  const likeHandler = () => {
    dispatch(likePost(value._id));
  };

  const [comment, setComment] = useState("");

  const addCommentHandler = async (e) => {
    e.preventDefault();

    const result = await dispatch(addComment({ id: value?._id, comment }));
    if (addComment.fulfilled.match(result)) {
      setComment("");
      // setShow(false);
      // dispatch(fetchPosts({ cursor: null })); // only if needed
    }
  };

  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const deleteHandler = async () => {
    const result = await dispatch(deletePost(value?._id));
    if (deletePost.fulfilled.match(result)) {
      dispatch(fetchPosts({ cursor: null })); // only if needed
    }
  };

  const [showInput, setShowInput] = useState(false);
  const editHandler = () => {
    setShowModal(false);
    setShowInput(true);
  };

  const [caption, setCaption] = useState(value.caption ? value.caption : "");
  const [captionLoading, setCaptionLoading] = useState(false);
  const [postData, setPostData] = useState(value);


  async function updateCaption() {
    setCaptionLoading(true);
    try {
      const { data: updatedPost } = await axios.put(
        `${API_BASE_URL}/api/post/${value._id}`,
        { caption },
        { withCredentials: true }
      );

      toast.success("Caption updated");

      // ✅ update the post in local UI
      setPostData((prev) => ({
        ...prev,
        caption: updatedPost.caption, // or whatever is returned from backend
      }));
      setCaption(updatedPost?.caption)
      // value.caption = updatedPost.caption;
      setShowInput(false);
    } catch (error) {
      console.log("Error", error)
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setCaptionLoading(false);
    }
  }

  const [open, setOpen] = useState(false);

  const oncloseLIke = () => {
    setOpen(false);
  };

  const { onlineUsers } = SocketData();
  // const { socket, onlineUsers } = useSelector((state) => state.socket);


  return (
    <div className="bg-gray-100 flex items-center justify-center pt-3 pb-14 w-[100%] min-[867px]:w-[750px]">
      <SimpleModal isOpen={showModal} onClose={closeModal}>
        <LikeModal isOpen={open} onClose={oncloseLIke} id={value._id} />
        <div className="flex flex-col items-center justify-center gap-3">
          <button
            onClick={editHandler}
            className="bg-blue-400 text-white py-1 px-3 rounded-md"
          >
            Edit
          </button>
          <button
            onClick={deleteHandler}
            className="bg-red-400 text-white py-1 px-3 rounded-md"
            disabled={loading}
          >
            {loading ? <LoadingAnimation /> : "Delete"}
          </button>
        </div>
      </SimpleModal>
      <div className="bg-white p-8 rounded-lg shadow-md w-[90%] min-[867px]:w-[750px]">
        <div className="flex items-center space-x-2 justify-between">
          <Link
            className="flex items-center space-x-2"
            to={`/user/${value.owner._id}`}
          >
            <img
              src={value?.owner?.profilePic?.url}
              alt=""
              className="w-8 h-8 rounded-full"
            />



            <div>
              <div className="flex items-center gap-2" >
                <p className="text-gray-800 font-semibold">{value.owner.name}</p>
                {onlineUsers.includes(value.owner._id) && (
                  <div className="w-[10px] h-[10px] rounded-full font-bold bg-green-500 text-green-400"></div>
                )}
              </div>
              <div className="text-gray-500 text-sm">{formatDate}</div>
            </div>
          </Link>

          {value.owner._id === user._id && (
            <div className="text-gray-500 cursor-pointer rotate-90">
              <button
                onClick={() => setShowModal(true)}
                className="hover:bg-gray-50 rounded-full p-1 text-2xl"
              >
                <BsThreeDotsVertical />
              </button>
            </div>
          )}
        </div>

        <div className="mb-4 mt-4">
          {showInput ? (
            <>
              <textarea
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none w-full"
                placeholder="Enter Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
              ></textarea>

              {/* <input
                className="custom-input"
                style={{ width: "150px" }}
                type="text"
                placeholder="Enter Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
              /> */}
              <button
                onClick={updateCaption}
                className="text-sm bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-6 py-1 rounded-md"
                disabled={captionLoading}
              >
                {captionLoading ? <LoadingAnimation /> : "Update Caption"}
              </button>
              <button
                className="text-sm bg-red-500 text-white px-6 py-1 ml-2 rounded-md"
                onClick={() => setShowInput(false)}
              >
                X
              </button>
            </>
          ) : (
            <p className="text-gray-800 mt-3">{postData?.caption}</p>
          )}
        </div>

        <div className="mb-4">
          {type === "post" ? (
            <img
              src={value.post.url}
              alt=""
              className="object-cover rounded-md w-[100%] min-[867px]:w-[650px] h-auto"
            />
          ) : (
            <video
              src={value.post.url}
              alt=""
              className="min-[867px]:w-[650px] h-auto object-cover rounded-md"
              autoPlay
              controls
            />
          )}
        </div>
        <div className="flex items-center justify-between text-gray-500">
          <div className="flex items-center space-x-2">
            <span
              onClick={likeHandler}
              className="text-red-500 text-2xl cursor-pointer"
            >
              {value.likes.includes(user._id) ? <IoHeartSharp /> : <IoHeartOutline />}
              {/* {isLike ? <IoHeartSharp /> : <IoHeartOutline />} */}
            </span>
            <button
              className="hover:bg-gray-50 rounded-full p-1"
              onClick={() => setOpen(true)}
            >
              {value.likes.length} likes
            </button>
          </div>
          <button
            className="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1"
            onClick={() => setShow(!show)}
          >
            <BsChatFill />
            <span>{value.comments.length} comments</span>
          </button>
        </div>
        {show && (
          <>
            <form onSubmit={addCommentHandler} className="flex gap-3">
              <input
                type="text"
                className="custom-input"
                placeholder="Enter Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button className="bg-gray-100 rounded-lg px-5 py-2" type="submit">
                Add
              </button>
            </form>

            <hr className="mt-2 mb-2" />
            <p className="text-gray-800 font-semibold">Comments</p>
            <hr className="mt-2 mb-2" />
            <div className="mt-4">
              <div className="comments max-h-[200px] overflow-y-auto">
                {value.comments && value.comments.length > 0 ? (
                  value.comments.map((e) => (
                    <Comment
                      value={e}
                      key={e._id}
                      user={user}
                      owner={value.owner._id}
                      id={value._id}
                    />
                  ))
                ) : (
                  <p>No Comments</p>
                )}
              </div>
            </div>
          </>
        )}


      </div>
    </div>
  );
};

export default React.memo(PostCard);


export const Comment = ({ value, user, owner, id }) => {
  // const { deleteComment } = PostData();
  const dispatch = useDispatch();

  const deleteCommentHandler = async () => {
    const result = await dispatch(deleteComment({ id: id, commentId: value._id }));

    // if (deleteComment.fulfilled.match(result)) {
    //   dispatch(fetchPosts({ cursor: null })); // only if needed
    // }
  };
  return (
    <div className="flex items-center space-x-2 mt-2">
      <Link to={`/user/${value.user._id}`}>
        <img
          src={value?.user?.profilePic?.url}
          className="w-8 h-8 rounded-full"
          alt=""
        />
      </Link>
      <div>
        <p className="text-gray-800 font-semibold">{value.user.name}</p>
        <p className="text-gray-500 text-sm">{value.comment}</p>
      </div>

      {owner === user._id ? (
        ""
      ) : (
        <>
          {value.user._id === user._id && (
            <button onClick={deleteCommentHandler} className="text-red-500">
              <MdDelete />
            </button>
          )}
        </>
      )}

      {owner === user._id && (
        <button onClick={deleteCommentHandler} className="text-red-500">
          <MdDelete />
        </button>
      )}
    </div>
  );
};
