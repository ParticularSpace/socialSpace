import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { Canvas } from '@react-three/fiber';
import { Login, Register, Profile, Home, Header, CreatePost, EditProfile, Friends, LoadingScreen } from './components';
import { Stars } from './components/Background';

import { isAuthenticated } from './utils/auth';


function AppContent() {
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Simulate 3 seconds of overall loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const location = useLocation();
  const isAuth = isAuthenticated();

  return (
    <div className="AppSc">
      {(isLoading) ? <LoadingScreen /> : null}
      <div className='TopSide'>
        {(location.pathname !== '/login' && location.pathname !== '/register' && isAuth) ? <Header /> : null}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/" element={isAuthenticated() ? <Home /> : <Login />} />
        </Routes>
      </div>
      <div>
        <Canvas camera={{ position: [0, 0, 1] }} style={{ background: '#000', width: '100vw', height: '100vh' }}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} castShadow />
          <Stars />
        </Canvas>
      </div>
    </div>
  );
}


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
