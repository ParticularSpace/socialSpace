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
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full p-4 bg-gray-700 rounded-lg shadow-md flex">
        <div className="w-1/2 p-2">
          <h1 className="text-3xl font-semibold mb-4 text-center text-white">Create a New Post</h1>
          <p className="text-white mb-4 text-center">You can post an image, text, or both!</p>
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

            <div className="flex justify-between items-center">
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                <div className="flex items-center text-white">
                  <span className="ml-1">Add Photo</span>
                </div>
              </label>

              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
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

        <div className="w-1/2 p-2 flex flex-col items-center justify-center">
          {preview && (
            <img
              className="h-48 w-48 object-cover rounded-lg"
              src={preview}
              alt="Preview"
            />
          )}
          {!preview && (
            <div className="text-white text-center">
              Image preview will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
