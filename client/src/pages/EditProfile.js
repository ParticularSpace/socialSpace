import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { UPDATE_PROFILE, UPLOAD_AVATAR } from '../graphql/mutations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const EditProfile = () => {
  const [username, setUsername] = useState(''); // Initialize to current username
  const [email, setEmail] = useState('');       // Initialize to current email
  const [bio, setBio] = useState('');           // Initialize to current bio
  const [profile_picture, setProfilePic] = useState(null); // Initialize to current 
  const [updateProfile, { loading, error }] = useMutation(UPDATE_PROFILE);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null); // New state
  const avatarFileInputRef = useRef(null);  // New ref
  const [uploadAvatar] = useMutation(UPLOAD_AVATAR); // New mutation

// Function to handle avatar upload
const handleUploadAvatar = async () => {
  setAvatarLoading(true);
  try {
    if (avatarFile) {
      const { data } = await uploadAvatar({ variables: { avatar: avatarFile } });
      if (data.uploadAvatar) {
        setUploadSuccess(true);
      } else {
        setUploadSuccess(false);  
      }
    }
    setAvatarLoading(false);
  } catch (error) {
    console.error('Error uploading avatar:', error);
    setUploadSuccess(false); 
  }
};

// Function to handle file change and reset uploadSuccess
const handleAvatarFileChange = (event) => {
  const file = event.target.files[0];
  setAvatarFile(file);
  setUploadSuccess(false);  // Reset the uploadSuccess state
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
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4 px-4">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="p-4">
  
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-lg font-medium mb-4">Profile Picture</h2>
            <div className="relative inline-block mb-4">
              {avatarFile ? (
                <img
                  src={URL.createObjectURL(avatarFile)}
                  alt="Uploaded preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                profile_picture && (
                  <img
                    src={profile_picture}
                    alt="Current profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )
              )}
            </div>
            {avatarFile ? (
              <button
                className="bg-blue-500 text-white rounded px-4 py-2"
                onClick={handleUploadAvatar}
              >
                {avatarLoading ? 'Uploading...' : 'Upload'}
              </button>
            ) : (
              <button
                onClick={() => avatarFileInputRef.current.click()}
                className="bg-blue-500 text-white rounded px-4 py-2 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faPen} />
                <span className="ml-2">Edit</span>
              </button>
            )}
            <input
              id="profile_picture"
              type="file"
              onChange={handleAvatarFileChange}
              ref={avatarFileInputRef}
              className="hidden"
            />
            {uploadSuccess && <span className="text-blue-500 mt-2">✓ Uploaded successfully</span>}
          </div>





          Username
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
