import { Link, useLocation } from 'react-router-dom';
import React from 'react';

const Header = () => {

  // Logout function
  const logout = () => {
    localStorage.removeItem('id_token');
    window.location.replace('/');
  };

  const isAuthenticated = localStorage.getItem('id_token');
  const location = useLocation();

  return (
    <div className="fixed inset-x-0 top-0 md:bottom-0 z-10 bg-white shadow-md md:top-auto">
      <div className="max-w-screen-lg mx-auto flex justify-between items-center px-4 py-2">
        {!isAuthenticated && (
          <>
            <div className="text-gray-600" title="Login">
              <Link to="/login" className="text-xl">
                🛂
              </Link>
            </div>
            <div className="text-gray-600" title="Register">
              <Link to="/register" className="text-xl">
                🆕
              </Link>
            </div>
          </>
        )}
        {isAuthenticated && (
          <>
            <div className="text-gray-600" title="Home">
              <Link to="/home" className="text-xl">
                Home
              </Link>
            </div>
            <div className="text-gray-600" title="Profile">
              <Link to="/profile" className="text-xl">
                Profile
              </Link>
            </div>
            <div className="text-gray-600" title="Logout">
              <button onClick={logout} className="text-xl">
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
