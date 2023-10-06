import { Link } from 'react-router-dom';
import React, { useState } from 'react';

const Header = () => {
  // Logout function
  const logout = () => {
    localStorage.removeItem('id_token');
    window.location.replace('/');
  };

  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const isAuthenticated = localStorage.getItem('id_token');

  return (
    <>
      {/* Search Bar at the Top */}
      <div className="fixed inset-x-0 top-4 z-20  text-black p-2">
        <div className="max-w-screen-lg mx-auto">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded bg-gray-200 text-black w-full"
          />
        </div>
      </div>


      {/* Bottom Navigation */}
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