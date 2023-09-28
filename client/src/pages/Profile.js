import { useState, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_PIC, GET_POSTS } from "../graphql/queries";
import { UPLOAD_AVATAR } from "../graphql/mutations";
import jwt_decode from "jwt-decode";
import Header from '../components/Header';

export function Profile() {
  const [avatarFile, setAvatarFile] = useState(null);
  const avatarFileInputRef = useRef(null);

  const [uploadAvatar] = useMutation(UPLOAD_AVATAR);

  const handleAvatarFileChange = (event) => {
    const file = event.target.files[0];
    setAvatarFile(file);
  };

  const handleUploadAvatar = async () => {
    try {
      if (avatarFile) {
        await uploadAvatar({ variables: { avatar: avatarFile } });
        alert('Avatar uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar.');
    }
  };

  const token = localStorage.getItem("id_token");
  const decodedToken = jwt_decode(token);
  const username = decodedToken.data.username;
  const _id = decodedToken.data._id;

  const { loading, error, data } = useQuery(GET_POSTS, { variables: { _id } });
  const { loading: userLoading, error: userError, data: userData } = useQuery(GET_USER_PIC, { variables: { username } });

  if (loading || userLoading) return <p>Loading...</p>;
  if (error || userError) return <p>Error: {error?.message || userError?.message}</p>;

  const user = userData.user;

  return (
    <div className="container mx-auto px-4 md:pt-16 pt-4">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full bg-white z-10 md:hidden">
        <Header />
      </div>
      <div className="fixed top-0 left-0 w-full bg-white z-10 hidden md:block">
        <Header />
      </div>
  
      {/* Profile section */}
      <div className="flex items-center mt-0">
        <div className="w-1/4 ml-4">
          <div className={`relative mx-auto rounded-full hover:shadow-lg cursor-pointer w-20 h-20 md:w-32 md:h-32`}>
            <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" ref={avatarFileInputRef} />
            {user.profile_picture && <img src={user.profile_picture} alt="Profile Avatar" className="w-full h-full rounded-full object-cover" />}
            {avatarFile && <img src={URL.createObjectURL(avatarFile)} alt="Uploaded Avatar" className="w-full h-full rounded-full object-cover" />}
          </div>
          {avatarFile && (
            <button className="block mx-auto mt-2 bg-blue-500 text-white rounded p-1" onClick={handleUploadAvatar}>Upload Avatar</button>
          )}
        </div>
        
        <div className="w-3/4 md:ml-6 ml-4">
          <h1 className="text-2xl font-bold">{username}</h1>
          <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200">
            Edit Profile
          </button>
          <div className="flex mt-4">
            <div className="mr-8">
              <span className="text-lg font-bold">{data.posts.length}</span> posts
            </div>
            <div className="mr-8">
              {/* Replace '0' with actual data */}
              <span className="text-lg font-bold">0</span> followers
            </div>
            <div>
              {/* Replace '0' with actual data */}
              <span className="text-lg font-bold">0</span> following
            </div>
          </div>
        </div>
      </div>
      
      {/* Bio */}
      <div className="mt-6 p-4 bg-gray-100 border rounded">
        <p>Short bio or description</p>
      </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mt-8">
        {data.posts.map((post) => (
          <div className="relative w-full pb-[100%] md:pb-[100%] rounded hover:shadow-lg">
            <img src={post.photo} alt={post.content} className="absolute top-0 left-0 w-full h-full rounded object-cover" />
            <div className="absolute top-0 left-0 w-full h-full rounded flex items-center justify-center text-white transition-opacity duration-300 hover:opacity-100 opacity-0">
              <span className="text-sm bg-black bg-opacity-70 rounded p-1">
                {post.content}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;




