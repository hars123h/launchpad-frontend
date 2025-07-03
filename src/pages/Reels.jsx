import React, { useEffect, useState } from "react";
import AddPost from "../components/AddPost";
// import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowUp, FaArrowDownLong } from "react-icons/fa6";
import { Loading } from "../components/Loading";

import { useSelector, useDispatch } from "react-redux";

import { fetchPosts } from "../redux/post/postActions.js";

const Reels = () => {
  // const { reels, loading } = PostData();
  const dispatch = useDispatch();
  const { reels, loading } = useSelector((state) => state.post);

  useEffect(() => {
    if (reels.length === 0) {
      dispatch(fetchPosts({ type: "reel" }));
    }
  }, [dispatch]);
  const [index, setIndex] = useState(0);

  const prevReel = () => {
    if (index === 0) {
      console.log("null");
      return null;
    }
    setIndex(index - 1);
  };
  const nextReel = () => {
    if (index === reels.length - 1) {
      console.log("null");
      return null;
    }
    setIndex(index + 1);
  };

  console.log("Reels", reels)


  return (
    <>
      {/* {loading ? (
        <Loading />
      ) : ( */}
      <div className="bg-gray-100">
        <AddPost type="reel" />
        <div className="flex  w-full gap-2 justify-center items-center flex-col ">
          {reels && reels.length > 0 ? (
            reels?.map((e) => <PostCard key={e._id} value={e} type={"reel"} />)

          ) : (
            <p>No reels yet</p>
          )}
          {/* <div className="button flex flex-col justify-center items-center gap-6">
            {index === 0 ? (
              ""
            ) : (
              <button
                className="bg-gray-500 text-white py-5 px-5 rounded-full"
                onClick={prevReel}
              >
                <FaArrowUp />
              </button>
            )}
            {index === reels?.length - 1 ? (
              ""
            ) : (
              <button
                className="bg-gray-500 text-white py-5 px-5 rounded-full"
                onClick={nextReel}
              >
                <FaArrowDownLong />
              </button>
            )}
          </div> */}
        </div>
      </div>
      {/* )} */}
    </>
  );
};

export default Reels;
