import { Link } from 'react-router-dom';
import React, { useState } from 'react';

const Header = () => {
  // Logout function
  const logout = () => {
    localStorage.removeItem('id_token');
    window.location.replace('/');
  };

  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [menuOpen, setMenuOpen] = useState(false); // State to handle the hamburger menu
  const isAuthenticated = localStorage.getItem('id_token');

  return (
    <div className="fixed inset-x-0 z-10 text-white mb-4">
      <div className="max-w-screen-lg mx-auto flex items-center px-6 py-4">
        {/* Logo or App name */}
        <div className="text-2xl font-bold md:block hidden start-0">
          Social Space
        </div>
        
        {/* Hamburger Menu */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="flex items-center space-x-4 mx-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded bg-white text-black"
          />
        </div>
        
        {/* Navigation */}
        <div className={`flex end space-x-4 ${menuOpen ? 'block' : 'hidden'} md:flex`}>
          {!isAuthenticated ? (
            <>
              <div title="Login">
                <Link to="/login" className="text-xl hover:underline">
                  Login
                </Link>
              </div>
              <div title="Register">
                <Link to="/register" className="text-xl hover:underline">
                  Register
                </Link>
              </div>
            </>
          ) : (
            <>
              <div title="Home">
                <Link to="/home" className="text-xl hover:underline">
                  Home
                </Link>
              </div>
              <div title="Create Post">
                <Link to="/createpost" className="text-xl hover:underline">
                  Create Post
                </Link>
              </div>
              <div title="Profile">
                <Link to="/profile" className="text-xl hover:underline">
                  Profile
                </Link>
              </div>
              <div title="Logout">
                <button onClick={logout} className="text-xl hover:underline">
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white text-black p-4">
         {/* Navigation */}
        <div className="flex md:space-x-4 space-x-0 md:mb-0 mb-2">
          {!isAuthenticated ? (
            <>
              <div title="Login">
                <Link to="/login" className="text-xl hover:underline">
                  Login
                </Link>
              </div>
              <div title="Register">
                <Link to="/register" className="text-xl hover:underline">
                  Register
                </Link>
              </div>
            </>
          ) : (
            <>
              <div title="Home">
                <Link to="/home" className="text-xl hover:underline">
                  Home
                </Link>
              </div>
              <div title="Create Post">
                <Link to="/createpost" className="text-xl hover:underline">
                  Create Post
                </Link>
              </div>
              <div title="Profile">
                <Link to="/profile" className="text-xl hover:underline">
                  Profile
                </Link>
              </div>
              <div title="Logout">
                <button onClick={logout} className="text-xl hover:underline">
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
        </div>
      )}
    </div>
  );
};

export default Header;
