import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Canvas } from '@react-three/fiber';
import { Dice, Login, Register, Profile, Home, Header, Stars, CreatePost, EditProfile } from './components';

function App() {
  const [LightTheme, setLightTheme] = useState(false);
  const [Background, setBackground] = useState('#333333');

  return (
    <div className="AppSc">
      <div className='TopSide'>
        <Router>
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/home" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </Router>
      </div>
      <div className='BotSide hight-screen width-screen'>
        <Canvas camera={{ position: [0, 0, 1] }}>
          <color attach={'background'} args={[Background]} />
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} castShadow />
          {LightTheme ? <Dice /> : <Stars />}
        </Canvas>
      </div>
    </div>
  );
}

export default App;
