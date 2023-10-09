import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { SEARCH_USERS } from '../graphql/queries';

const Header = () => {
  const logout = () => {
    localStorage.removeItem('id_token');
    window.location.replace('/');
  };

  const [searchQuery, setSearchQuery] = useState('');
  const isAuthenticated = localStorage.getItem('id_token');

  const { loading, error, data } = useQuery(SEARCH_USERS, {
    variables: { searchTerm: searchQuery },
    skip: !searchQuery
  });

    // Function to handle click on username
    const handleUserClick = (userId) => {
      // Do something when a user is selected, e.g., navigate to user's profile
    };

  console.log("search_users data", data);

  return (
    <>
      {/* Search Bar at the Top */}
      <div className="fixed inset-x-0 top-4 z-20 text-black p-2">
        <div className="max-w-screen-lg mx-auto">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded bg-gray-200 text-black w-full"
          />
          {searchQuery && (
            <div className="mt-2 bg-white border rounded shadow-lg">
              {loading && <div className="p-4">Loading...</div>}
              {error && <div className="p-4">Error: {error.message}</div>}
              {data && data.searchUsers.length > 0 ? (
                data.searchUsers.map(user => (
                  <div 
                    key={user._id} 
                    onClick={() => handleUserClick(user._id)}
                    className="cursor-pointer hover:bg-gray-200 p-4 border-b"
                  >
                    {user.username}
                  </div>
                ))
              ) : (
                <div className="p-4">No users found</div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-10 bg-white text-black p-4">
        <div className="max-w-screen-lg mx-auto flex justify-between">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-xl hover:underline">Login</Link>
              <Link to="/register" className="text-xl hover:underline">Register</Link>
            </>
          ) : (
            <>
              <Link to="/home" className="text-xl hover:underline">Home</Link>
              <Link to="/createpost" className="text-xl hover:underline">Create Post</Link>
              <Link to="/profile" className="text-xl hover:underline">Profile</Link>
              <button onClick={logout} className="text-xl hover:underline">Logout</button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
