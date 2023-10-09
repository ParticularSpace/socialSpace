import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { FETCH_USER_PROFILE } from '../graphql/queries';

const ViewProfile = () => {
  const { username } = useParams();
  const { loading, error, data } = useQuery(FETCH_USER_PROFILE, {
    variables: { username }
  });

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error.message}</p>;

  const user = data.user;

  return (
    <div className="h-screen ">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-semibold mb-2">{user.username}'s Profile</h1>
          <img className="w-32 h-32 rounded-full mx-auto mb-4" src={user.profile_picture} alt={`${user.username}'s profile`} />
          <p className="text-lg mb-4">Bio: {user.bio}</p>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Followers:</h3>
            {user.followers.map(follower => (
              <div key={follower._id} className="text-lg">{follower.username}</div>
            ))}
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Following:</h3>
            {user.following.map(following => (
              <div key={following._id} className="text-lg">{following.username}</div>
            ))}
          </div>
          {/* Placeholder for future data points */}
          <div>
            <h3 className="text-xl font-semibold">Posts:</h3>
            {/* You will populate this later */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
