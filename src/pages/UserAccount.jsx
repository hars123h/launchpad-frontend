import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowDownLong, FaArrowUp } from "react-icons/fa6";
import axios from "axios";
import { Loading } from "../components/Loading";
// import { UserData } from "../context/UserContext";
import Modal from "../components/Modal";
// import { SocketData } from "../context/SocketContext";
import { followUser } from "../redux/user/userActions";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "../baseUrl";


const UserAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts, reels } = useSelector((state) => state.post);
  console.log("postssss", posts);

  // const { posts, reels } = PostData();
  const [user, setUser] = useState([]);
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const { user: loggedInUser } = useSelector((state) => state.user);

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/user/` + params.id,
        {
          withCredentials: true,
        }

      );

      setUser(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  console.log(user);

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  let myPosts;

  if (posts) {
    myPosts = posts.filter((post) => post.owner._id === user._id);
  }
  let myReels;

  if (reels) {
    myReels = reels.filter((reel) => reel.owner._id === user._id);
  }

  const [type, setType] = useState("post");

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

  const [followed, setFollowed] = useState(false);

  // const { followUser } = UserData();

  const followHandler = () => {
    setFollowed(!followed);
    dispatch(followUser({ id: user._id, fetchUser }));

  };

  const followers = user.followers;

  useEffect(() => {
    if (followers && followers.includes(loggedInUser._id)) setFollowed(true);
  }, [user]);

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);

  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);

  async function followData() {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/user/followdata/` + user._id,
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

  useEffect(() => {
    followData();
  }, [user]);

  // const { onlineUsers } = SocketData();
  const { onlineUsers } = useSelector((state) => state.socket);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {user && (
            <>
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
                <div className="bg-white w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8 p-8 rounded-2xl shadow-md">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={user.profilePic.url}
                      alt="Profile"
                      className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover shadow-md"
                    />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 flex flex-col gap-3 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                      <p className="text-2xl font-semibold text-gray-800">{user.name}</p>
                      {onlineUsers.includes(user._id) && (
                        <span className="text-sm text-green-500 font-medium bg-green-100 px-2 py-1 rounded-full">
                          Online
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm">{user.email}</p>
                    <p className="text-gray-600 text-sm capitalize">{user.gender}</p>

                    {/* Followers / Followings */}
                    <div className="flex justify-center md:justify-start gap-4">
                      <p
                        className="text-blue-600 font-medium cursor-pointer hover:underline"
                        onClick={() => setShow(true)}
                      >
                        {user.followers.length} Followers
                      </p>
                      <p
                        className="text-blue-600 font-medium cursor-pointer hover:underline"
                        onClick={() => setShow1(true)}
                      >
                        {user.followings.length} Following
                      </p>
                    </div>

                    {/* Follow/Unfollow Button */}
                    {user._id !== loggedInUser._id && (
                      <div className="mt-4">
                        <button
                          onClick={followHandler}
                          className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${followed
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-blue-500 hover:bg-blue-600"
                            } text-white`}
                        >
                          {followed ? "Unfollow" : "Follow"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

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
            </>
          )}
        </>
      )}
    </>
  );
};

export default UserAccount;
