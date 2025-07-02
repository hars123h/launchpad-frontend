import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LoadingAnimation } from "../components/Loading";
import { API_BASE_URL } from "../baseUrl";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  async function fetchUsers() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/user/all?search=` + search,
        {
          withCredentials: true,
        }
      );

      setUsers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Search Input and Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            className="w-full sm:w-auto flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={fetchUsers}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-violet-500 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-all duration-200"
          >
            Search
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingAnimation />
          </div>
        ) : users && users.length > 0 ? (
          <div className="space-y-3">
            {users.map((e) => (
              <Link
                key={e._id}
                to={`/user/${e._id}`}
                className="flex items-center gap-4 bg-white shadow-md hover:shadow-lg transition-all rounded-lg px-4 py-3"
              >
                <img
                  src={e.profilePic.url}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-gray-800 font-medium">{e.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No users found. Try searching again.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
