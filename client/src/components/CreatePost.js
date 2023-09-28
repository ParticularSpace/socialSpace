import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { ADD_POST } from '../graphql/mutations';

function CreatePost() {
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [addPost, { error }] = useMutation(ADD_POST);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await addPost({
        variables: {
          content,
          photo,
        },
      });
      setContent('');
      setPhoto(null);
      setPreview(null);
      window.location.replace('/home');
    } catch (e) {
      console.error(e);
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setPhoto(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreview(reader.result);
    };
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-4 text-center">Create a New Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative rounded-md shadow-sm">
            <textarea
              className="w-full p-2 rounded-md border border-gray-300"
              placeholder="What's on your mind?"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>

          {preview && (
            <div className="flex justify-center">
              <img
                className="h-32 w-32 object-cover rounded-lg"
                src={preview}
                alt="Preview"
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <div className="flex items-center text-blue-500">
                <span className="ml-1">Add Photo</span>
              </div>
            </label>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
            >
              Post
            </button>
          </div>

          {error && (
            <div className="text-center text-red-600">
              {`Error: ${error.message}`}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
