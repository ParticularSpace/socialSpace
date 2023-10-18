import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { SEARCH_USERS } from "../graphql/queries";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("id_token");
    window.location.replace("/");
  };

  const [searchQuery, setSearchQuery] = useState("");
  const isAuthenticated = localStorage.getItem("id_token");

  const { loading, error, data } = useQuery(SEARCH_USERS, {
    variables: { searchTerm: searchQuery },
    skip: !searchQuery,
  });

  // Function to handle click on username
  const handleUserClick = (userId, username) => {
    navigate(`/view-profile/${username}`);
    setSearchQuery("");
  };


  return (
    <>
      {/* Overhauled Search Bar at the Top */}
      <div className="fixed inset-x-0 top-0 z-50 bg-black shadow-md p-4">
        <div className="container mx-auto">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-full border-2 focus:outline-none focus:border-blue-400"
          />
          {searchQuery && (
            <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-600">Loading...</div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">Error: {error.message}</div>
              ) : (
                <>
                  {data && data.searchUsers.length > 0 ? (
                    data.searchUsers.slice(0, 5).map((user) => (
                      <div
                        key={user._id}
                        onClick={() => handleUserClick(user._id, user.username)}
                        className="flex items-center p-4 hover:bg-gray-100 cursor-pointer transition duration-300 ease-in-out"
                      >
                        <div className="text-lg font-medium hover:text-blue-600">
                          {user.username}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-600"></div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    
    
      <div className="fixed inset-x-0 bottom-0 z-10 bg-white text-black p-4">
        <div className="max-w-screen-lg mx-auto flex justify-between">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-xl hover:underline">
                Login
              </Link>
              <Link to="/register" className="text-xl hover:underline">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/home" className="text-xl hover:underline">
                Home
              </Link>
              <Link to="/createpost" className="text-xl hover:underline">
                Create Post
              </Link>
              <Link to="/profile" className="text-xl hover:underline">
                Profile
              </Link>
              <button onClick={logout} className="text-xl hover:underline">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
