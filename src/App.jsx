import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import { UserData } from "./context/UserContext";
import Account from "./pages/Account";
import NavigationBar from "./components/NavigationBar";
import NotFound from "./components/NotFound";
import Reels from "./pages/Reels";
import { Loading } from "./components/Loading";
import UserAccount from "./pages/UserAccount";
import Search from "./pages/Search";
import ChatPage from "./pages/ChatPage";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./redux/user/userActions";
import axios from "axios";
import { fetchPosts } from "./redux/post/postActions.js";
import { connectSocket } from "./redux/socket/socketActions";
import { Toaster } from "react-hot-toast";



const App = () => {
  const dispatch = useDispatch();
  // const [posts, setPosts] = useState([]);
  // const [reels, setReels] = useState([]);


  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const { loading, isAuth, user } = useSelector((state) => state.user);
  const { posts, reels, postsCursor, cursor } = useSelector((state) => state.post);

  // console.log("USER", user);
  // console.log("IS AUTH MAUN PAGE", isAuth);


  // async function fetchPosts() {
  //   try {
  //     const { data } = await axios.get("/api/post/all");
  //     setPosts(data?.posts);
  //     setReels(data?.reels);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // useEffect(() => {
  //   dispatch(fetchPosts({ type: "post", limit: 5})); // only first page
  // }, [dispatch]);

  // useEffect(() => {
  //   if (user && isAuth) {
  //     dispatch(connectSocket(user._id));
  //   }
  // }, [user, isAuth]);

  return (
    <>
      {/* {loading ? (
        <Loading />
      ) : ( */}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuth ? <Home posts={posts} postsCursor={postsCursor} /> : <Login />} />
          <Route path="/reels" element={isAuth ? <Reels /> : <Login />} />
          <Route
            path="/account"
            element={isAuth ? <Account user={user} posts={posts} reels={reels} /> : <Login />}
          />
          <Route
            path="/user/:id"
            element={isAuth ? <UserAccount user={user} /> : <Login />}
          />
          <Route path="/login" element={!isAuth ? <Login /> : <Home posts={posts} />} />
          <Route
            path="/register"
            element={!isAuth ? <Register /> : <Home posts={posts} />}
          />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/register"
            element={!isAuth ? <Register /> : <Home posts={posts} />}
          />
          <Route path="/search" element={isAuth ? <Search /> : <Login />} />
          <Route
            path="/chat"
            element={isAuth ? <ChatPage user={user} /> : <Login />}
          />
        </Routes>
        {isAuth && <NavigationBar />}
      </BrowserRouter>
      {/* )} */}
    </>
  );
};

export default App;
