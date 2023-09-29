import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { UPDATE_PROFILE } from '../graphql/mutations'; 

const EditProfile = () => {
  const [username, setUsername] = useState(''); // Initialize to current username
  const [email, setEmail] = useState('');       // Initialize to current email
  const [bio, setBio] = useState('');           // Initialize to current bio
  const [profile_picture, setProfilePic] = useState(null); // Initialize to current 
  const [updateProfile, { loading, error }] = useMutation(UPDATE_PROFILE);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create an object to hold only the fields that have been filled out
    const updatedFields = {};
  
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (profile_picture) updatedFields.profile_picture = profile_picture; // Changed to profile_picture
  
    try {
      // Execute the updateProfile mutation
      await updateProfile({
        variables: {
          ...updatedFields  // Pass updated fields as variables to your mutation
        }
      });
      // Navigate back to the profile page after successful update
      navigate('/profile');
    } catch (e) {
      console.error("An error occurred while updating the profile:", e);
    }
  };
  
  
  
  

  return (
    <div className="container mx-auto mt-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded border focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded border focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 rounded border focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Profile Picture */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profile_picture">
              Profile Picture
            </label>
            <input
              id="profile_picture"
              type="file"
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="w-full px-3 py-2 rounded border focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
