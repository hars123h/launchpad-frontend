import React, { useEffect, useState } from "react";
import AddPost from "../components/AddPost";
import PostCard from "../components/PostCard";
// import { PostData } from "../context/PostContext";
import { Loading } from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchPosts } from "../redux/post/postActions.js";
// import { fetchPosts } from "../redux/post/postActions";

const Home = () => {
  // const { posts, loading } = PostData();

  // const [posts, setPosts] = useState([])


  const dispatch = useDispatch()

  const { posts, fetchLoading, postsCursor, hasMorePosts } = useSelector((state) => state.post);

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts({ type: "post" }));
    }
  }, [dispatch]);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (
  //       window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
  //       !fetchLoading &&
  //       hasMorePosts
  //     ) {
  //       dispatch(fetchPosts({ type: "post", limit: 5, cursor: postsCursor }));
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [dispatch, fetchLoading, postsCursor, hasMorePosts]);

  return (
    <>
      {/* {fetchLoading ? (
        <Loading />
      ) : ( */}
      <div>
        <AddPost type="post" />
        <div className="w-full flex justify-center items-center flex-col bg-gray-100">
          {posts && posts.length > 0 ? (
            posts.map((e) => <PostCard value={e} key={e?._id} type={"post"} />)
          ) : (
            <p>No Post Yet</p>
          )}
        </div>
      </div>
      {/* )} */}
    </>
  );
};

export default Home;
