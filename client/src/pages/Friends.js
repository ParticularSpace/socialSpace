import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_FRIENDS, GET_FOLLOWERS, GET_FOLLOWING } from "../graphql/queries";
import { ADD_FRIEND, ACCEPT_FRIEND_REQUEST, DECLINE_FRIEND_REQUEST, REMOVE_FRIEND } from "../graphql/mutations";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const { loading: loadingFriends, data: dataFriends } = useQuery(GET_FRIENDS);
  const { loading: loadingFollowers, data: dataFollowers } = useQuery(GET_FOLLOWERS);
  const { loading: loadingFollowing, data: dataFollowing } = useQuery(GET_FOLLOWING);

  const [addFriend] = useMutation(ADD_FRIEND);
  const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST);
  const [declineFriendRequest] = useMutation(DECLINE_FRIEND_REQUEST);
  const [removeFriend] = useMutation(REMOVE_FRIEND);

  useEffect(() => {
    if (dataFriends) setFriends(dataFriends.friends);
    if (dataFollowers) setFollowers(dataFollowers.followers);
    if (dataFollowing) setFollowing(dataFollowing.following);
  }, [dataFriends, dataFollowers, dataFollowing]);

  const handleAddFriend = async (friendId) => {
    await addFriend({ variables: { friendId } });
  };


  const handleAcceptFriendRequest = async (friendId) => {
    await acceptFriendRequest({ variables: { friendId } });
  };

  const handleDeclineFriendRequest = async (friendId) => {
    await declineFriendRequest({ variables: { friendId } });
  };

  const handleRemoveFriend = async (friendId) => {
    await removeFriend({ variables: { friendId } });
  };

  return (
    <div className="container mx-auto p-4 mt-16">

      <h1 className="text-2xl font-bold mb-4">Friends</h1>
      {loadingFriends ? (
        <p className="text-gray-500">Loading friends...</p>
      ) : friends.length > 0 ? (
        friends.map((friend) => (
          <div key={friend.id} className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2">
            <span>{friend.username}</span>
            <div>
              <button onClick={() => handleAcceptFriendRequest(friend.id)} className="bg-blue-500 text-white p-2 rounded mr-2">
                Accept
              </button>
              <button onClick={() => handleDeclineFriendRequest(friend.id)} className="bg-red-500 text-white p-2 rounded mr-2">
                Decline
              </button>
              <button onClick={() => handleRemoveFriend(friend.id)} className="bg-yellow-500 text-white p-2 rounded">
                Remove
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">You have no friends yet.</p>
      )}

      <h1 className="text-2xl font-bold mb-4 mt-6">Followers</h1>
      {loadingFollowers ? (
        <p className="text-gray-500">Loading followers...</p>
      ) : followers.length > 0 ? (
        followers.map((follower) => (
          <div key={follower.id} className="bg-gray-100 p-2 rounded mb-2">
            {follower.username}
          </div>
        ))
      ) : (
        <p className="text-gray-500">You have no followers yet.</p>
      )}

      <h1 className="text-2xl font-bold mb-4 mt-6">Following</h1>
      {loadingFollowing ? (
        <p className="text-gray-500">Loading following...</p>
      ) : following.length > 0 ? (
        following.map((person) => (
          <div key={person.id} className="bg-gray-100 p-2 rounded mb-2">
            {person.username}
          </div>
        ))
      ) : (
        <p className="text-gray-500">You are not following anyone yet.</p>
      )}
    </div>
  );
};

export default Friends;
