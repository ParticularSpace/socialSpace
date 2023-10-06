import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div className="text-white">
        <ClipLoader color={'#FFFFFF'} loading={true} />
      </div>
    </div>
  );
};

export default LoadingScreen;
