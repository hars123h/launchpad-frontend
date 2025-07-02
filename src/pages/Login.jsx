import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { UserData } from "../context/UserContext";
// import { PostData } from "../context/PostContext";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, loginWithGoogle } from "../redux/user/userActions";
import { fetchPosts } from "../redux/post/postActions.js";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { isAuth } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuth) {
      // dispatch(fetchPosts());
      navigate("/account"); // or wherever you want to go after login
    }
  }, [isAuth]);

  console.log("IS AUTH", isAuth);


  const submitHandler = (e) => {
    e.preventDefault();
    // loginUser(email, password, navigate, fetchPosts);
    if (!email || !password) {
      return toast.error("All fields are required")
    }
    dispatch(loginUser({ email, password, navigate }));

  };
  const handleGoogleLogin = () => {
    dispatch(loginWithGoogle());
  };
  return (
    <>
      {/* {loading ? (
        <h1>Loading...</h1>
      ) : ( */}
        <div className="flex justify-center">
          <div className="flex flex-col justify-center items-center md:flex-row shadow-md rounded-xl max-w-7xl w-[90%] md:w-[50%] md:mt-[140px]">
            <div className="w-full md:w-3/4">
              <div className="text-xl cursor-pointer flex flex-col justify-center items-center mt-5 md:mt-0 py-4">
                <h1 className="font-semibold text-xl md:text-3xl text-gray-600 m-2">
                  Login to social media
                </h1>
              </div>

              <form onSubmit={submitHandler}>
                <div className="flex flex-col justify-center items-center m-2 space-y-6 md:space-y-8">
                  <input
                    type="email"
                    className="custom-input"
                    placeholder="User Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}

                  />
                  <input
                    type="password"
                    className="custom-input"
                    placeholder="User Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}

                  />
                </div>
                <div className="text-center mt-7">
                  <button className="auth-btn">Login</button>
                </div>
                <div className="w-full flex items-center justify-center ">
                  <button
                    onClick={handleGoogleLogin}
                    className="bg-red-500 text-white px-4 py-2 rounded-md mt-1 mb-5  w-[50%]"
                  >
                    Continue with Google
                  </button>
                </div>
              </form>
            </div>

            <div className="h-[100%] w-full md:w-1/3 bg-gradient-to-r from-pink-500 to-orange-400 items-center justify-center flex">
              <div className="text-white text-base font-semibold text-center my-10 space-y-2 m-2">
                <h1 className="text-5xl">Don't Have Account?</h1>
                <h1 className="!mb-4">Register to Social Media</h1>
                <Link
                  to="/register"
                  className="bg-white rounded-2xl px-4 text-emerald-400 py-1"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      {/* )} */}
    </>
  );
};

export default Login;
