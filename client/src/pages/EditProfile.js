import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { UPDATE_PROFILE, UPLOAD_AVATAR } from '../graphql/mutations';


const EditProfile = () => {
  const [username, setUsername] = useState(''); // Initialize to current username
  const [email, setEmail] = useState('');       // Initialize to current email
  const [bio, setBio] = useState('');           // Initialize to current bio
  const [profile_picture, setProfilePic] = useState(null); // Initialize to current 
  const [updateProfile, { loading, error }] = useMutation(UPDATE_PROFILE);

  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null); // New state
  const avatarFileInputRef = useRef(null);  // New ref
  const [uploadAvatar] = useMutation(UPLOAD_AVATAR); // New mutation

  // Function to handle avatar file change
  const handleAvatarFileChange = (event) => {
    const file = event.target.files[0];
    setAvatarFile(file);
  };

  // Function to handle avatar upload
  const handleUploadAvatar = async () => {
    try {
      if (avatarFile) {
        const { data } = await uploadAvatar({ variables: { avatar: avatarFile } });
        if (data.uploadAvatar.success) {
          setUploadSuccess(true);
        }
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an object to hold only the fields that have been filled out
    const updatedFields = {};

    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (bio) updatedFields.bio = bio;
    if (profile_picture) updatedFields.profile_picture = profile_picture; // Changed to profile_picture

    try {
      // Execute the updateProfile mutation
      await updateProfile({
        variables: {
          ...updatedFields  // Pass updated fields as variables to your mutation
        }
      });
      return;
    } catch (e) {
      console.error("An error occurred while updating the profile:", e);
    }
  };



  return (
    <div className="container mx-auto mb-16 mt-4 md:mt-32">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        <form onSubmit={handleSubmit}>

          {/* Profile Picture Upload */}
          <div className="mb-4 flex flex-col items-center">
            {avatarFile && (
              <img src={URL.createObjectURL(avatarFile)} alt="Uploaded preview" className="w-20 h-20 rounded-full object-cover mb-2" />
            )}
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profile_picture">
              Profile Picture
            </label>
            <input
              id="profile_picture"
              type="file"
              onChange={handleAvatarFileChange}
              ref={avatarFileInputRef}
              className="w-full px-3 py-2 rounded border focus:outline-none focus:border-blue-500"
            />
            {avatarFile && (
              <button className="mt-2 bg-blue-500 text-white rounded p-1" onClick={handleUploadAvatar}>
                Upload Profile Picture
              </button>
            )}
            {uploadSuccess && <span className="text-green-500 mt-2">✓ Uploaded successfully</span>}
          </div>


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
