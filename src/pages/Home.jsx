import React, { useEffect, useRef, useState } from "react";
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

  const { posts, fetchLoading, hasMore, nextCursor } = useSelector((state) => state.post);
  const loadMoreRef = useRef(null);

  // useEffect(() => {
  //   if (posts.length === 0) {
  //     dispatch(fetchPosts({ type: "post" }));
  //   }
  // }, [dispatch]);

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts({ limit: 5 }));
    }
  }, [dispatch, posts.length]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!hasMore || fetchLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("🔵 Auto-fetch triggered by IntersectionObserver");
          dispatch(fetchPosts({ cursor: nextCursor, limit: 5 }));
        }
      },
      { threshold: 1.0 }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [dispatch, hasMore, fetchLoading, nextCursor]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasMore || fetchLoading) return;

    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight;

    if (isVisible) {
      console.log("🟠 Manually triggering load because loadMoreRef is visible");
      dispatch(fetchPosts({ cursor: nextCursor, limit: 5 }));
    }
  }, [posts.length, hasMore, fetchLoading, nextCursor, dispatch]);

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

          {/* <button
            onClick={() => dispatch(fetchPosts({ cursor: nextCursor, limit: 5 }))}
            disabled={!hasMore || fetchLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded my-4"
          >
            Load More
          </button> */}
          {fetchLoading && <p className="text-center">Loading...</p>}

          <div ref={loadMoreRef} style={{ height: "80px" }} />

          {!hasMore && <p className="text-center text-gray-500">No more posts</p>}
        </div>

      </div>
      {/* )} */}
    </>
  );
};

export default Home;
