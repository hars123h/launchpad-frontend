import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser, updateProfilePic, updateProfileName, fetchUser } from "../redux/user/userActions";
import PostCard from "../components/PostCard";
import { FaArrowDownLong, FaArrowUp } from "react-icons/fa6";
import Modal from "../components/Modal";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "../baseUrl.js";

const Account = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading } = useSelector((state) => state.user);
  const { posts, reels } = useSelector((state) => state.post);


  const myPosts = useMemo(() => {
    if (!posts || !user) return [];
    return posts.filter((post) => post.owner._id === user._id);
  }, [posts, user]);

  const myReels = useMemo(() => {
    if (!reels || !user) return [];
    return reels.filter((reel) => reel.owner._id === user._id);
  }, [reels, user]);


  const [type, setType] = useState("post");

  const logoutHandler = async () => {
    const result = await dispatch(logoutUser()).unwrap();
    if (logoutUser.fulfilled.match(result)) {
      navigate("/login");
    }
  };


  const [index, setIndex] = useState(0);

  const prevReel = () => {
    if (index === 0) {
      console.log("null");
      return null;
    }
    setIndex(index - 1);
  };
  const nextReel = () => {
    if (index === myReels.length - 1) {
      console.log("null");
      return null;
    }
    setIndex(index + 1);
  };

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);

  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);

  async function followData() {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/user/followdata/` + user?._id,
        {
          withCredentials: true,
        }
      );
      setFollowersData(data.followers);
      setFollowingsData(data.followings);
    } catch (error) {
      console.log(error);
    }
  }

  const [file, setFile] = useState("");
  const [filePreview, setFilePreview] = useState("");


  const changeFileHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile)); // preview URL
    }
  };
  const changleImageHandler = async () => {
    try {

      const formdata = new FormData();
      formdata.append("file", file);


      const result = await dispatch(updateProfilePic({ id: user?._id, formdata })).unwrap();

      console.log("resukt", result);


      if (updateProfilePic.fulfilled.match(result)) {
        dispatch(fetchUser());
        setFile(null);
        setFilePreview("");
      }
    } catch (error) {
      console.log(error)

    }

  };

  useEffect(() => {
    followData();
  }, [user]);

  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState(user.name ? user.name : "");

  const UpdateName = async () => {
    console.log("update name", user?._id);

    const result = await dispatch(updateProfileName({ id: user?._id, name })).unwrap();
    if (updateProfileName.fulfilled.match(result)) {
      setShowInput(false);
      dispatch(fetchUser());
    }
  };

  const [showUpdatePass, setShowUpdatePass] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function updatePassword(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/" + user._id, {
        oldPassword,
        newPassword,
      });

      toast.success(data.message);
      setOldPassword("");
      setNewPassword("");
      setShowUpdatePass(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (


    <>
      {user && (


        <div className="bg-gray-100 min-h-screen flex flex-col gap-4 items-center justify-center pt-3 pb-14">
          {show && (
            <Modal
              value={followersData}
              title={"Followers"}
              setShow={setShow}
            />
          )}
          {show1 && (
            <Modal
              value={followingsData}
              title={"Followings"}
              setShow={setShow1}
            />
          )}
          <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg w-full max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">

              <div className="flex flex-col items-center gap-6 md:w-1/2">

                <img
                  src={filePreview || user.profilePic.url}
                  alt="Profile Preview"
                  className="w-44 h-44 rounded-full object-cover border-4 border-indigo-400 shadow-md transition-all duration-300 hover:scale-105"
                />


                <div className="w-full max-w-sm space-y-4">
                  <label className="block">
                    <span className="sr-only">Upload Profile Picture</span>
                    <input
                      type="file"
                      onChange={changeFileHandler}
                      accept="image/*"
                      className="block w-full text-sm text-gray-700
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-indigo-100 file:text-indigo-700
      hover:file:bg-indigo-200
      transition"
                    />
                  </label>

                  <button
                    onClick={changleImageHandler}
                    disabled={loading}
                    className={`w-full py-2 rounded-md text-white font-semibold transition 
        ${loading
                        ? "bg-indigo-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-500 to-violet-500 "
                      }`}
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </div>


              <div className="flex flex-col gap-4 w-full md:w-1/2">
                {showInput ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter Name"
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
                    />
                    <button
                      onClick={UpdateName}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setShowInput(false)}
                      className="bg-red-400 text-white px-3 py-2 rounded-full"
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <p className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    {user.name}
                    <button
                      onClick={() => setShowInput(true)}
                      className="text-gray-500 hover:text-indigo-500 text-xl"
                    >
                      <CiEdit />
                    </button>
                  </p>
                )}

                <p className="text-gray-600 text-sm">{user.email}</p>
                <p className="text-gray-600 text-sm capitalize">{user.gender}</p>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShow(true)}
                    className="text-gray-700 text-sm cursor-pointer hover:underline"
                  >
                    {user.followers.length} follower
                  </button>
                  <button
                    onClick={() => setShow1(true)}
                    className="text-gray-700 text-sm cursor-pointer hover:underline"
                  >
                    {user.followings.length} following
                  </button>
                </div>

                <button
                  onClick={logoutHandler}
                  className="mt-3 bg-red-500 hover:bg-red-600 transition text-white font-medium py-2 px-4 rounded-md w-fit"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowUpdatePass(!showUpdatePass)}
            className="bg-blue-500 px-2 py-1 rounded-sm text-white"
          >
            {showUpdatePass ? "X" : "Update Password"}
          </button>

          {showUpdatePass && (
            <form
              onSubmit={updatePassword}
              className="flex justify-center items-center flex-col bg-white p-2 rounded-sm gap-4"
            >
              <input
                type="password"
                className="custom-input"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <input
                type="password"
                className="custom-input"
                placeholder="new Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-blue-500 px-2 py-1 rounded-sm text-white"
              >
                Update Password
              </button>
            </form>
          )}

          <div className="controls flex justify-center items-center bg-white p-4 rounded-md gap-7">
            <button onClick={() => setType("post")}>Posts</button>
            <button onClick={() => setType("reel")}>Reels</button>
          </div>

          {type === "post" && (

            <>

              {myPosts && myPosts.length > 0 ? (
                myPosts.map((e) => (
                  <PostCard type={"post"} value={e} key={e._id} />
                ))
              ) : (
                <p>No Post Yet</p>
              )}


            </>
          )}
          {type === "reel" && (
            <>
              {myReels && myReels.length > 0 ? (
                <div className="flex gap-3 justify-center items-center">
                  <PostCard
                    type={"reel"}
                    value={myReels[index]}
                    key={myReels[index]._id}
                  />
                  <div className="button flex flex-col justify-center items-center gap-6">
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
                    {index === myReels.length - 1 ? (
                      ""
                    ) : (
                      <button
                        className="bg-gray-500 text-white py-5 px-5 rounded-full"
                        onClick={nextReel}
                      >
                        <FaArrowDownLong />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p>No Reels Yet</p>
              )}
            </>
          )}
        </div>


      )}
    </>


  );
};

export default Account;
