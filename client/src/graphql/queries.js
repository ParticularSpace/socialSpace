import { gql } from "@apollo/client";

export const GET_USER_POSTS = gql`
  query getUserPosts($userId: ID!) {
    getUserPosts(userId: $userId) {
      _id
      content
      photo
      createdAt
      user {
        _id
        username
      }
      likes {
        _id
        user {
          _id
          username
        }
        createdAt
        post {
          _id
        }
      }
      comments { 
        _id
        content
        user {
          _id
          username
        }
        createdAt
      }
    }
  }
`;




export const GET_POST_BY_ID = gql`
  query post($id: ID!) {
    post(id: $id) {
      _id
      content
      comments {
        _id
        content
        user {
          _id
          username 
        }
      }
    }
  }
`;


export const GET_ME = gql`
query GetMe {
    me {
      username
      email
      _id
    }
  }
  
`;

export const GET_USER = gql`
  query Me {
    me {
      _id
      username
      email
      date_of_birth
      profile_picture
      voice
      currency
      naughtyCount
    }
  }
`;

export const GET_PERSONALIZED_POSTS = gql`
  query userFeed($userId: ID!) {
    userFeed(userId: $userId) {
      _id
      content
      photo
      createdAt
      user {
        _id
        username
        profile_picture
      }
      likes {
        _id
        user {
          _id
          username
        }
        createdAt
        post {

          _id
        }
      }
      comments {
        _id
        content
        user {
          _id
          username
        }
        createdAt
      }
    }
  }
`;


export const GET_USER_PIC = gql`
query GetUserPic($username: String!) {
  user(username: $username) {
    username
    profile_picture
   
  }
}
`;

export const GET_FRIENDS = gql`
  query GetFriends {
    friends {
      _id
      username
    }
  }
`;


export const GET_FOLLOWERS = gql`
  query GetFollowers {
    followers {
      _id
      username
    }
  }
`;


export const GET_FOLLOWING = gql`
  query GetFollowing {
    following {
      _id
      username
    }
  }
`;

export const GET_FRIEND_REQUESTS = gql`
  query GetFriendRequests {
    friendRequests {
      _id
      username
    }
  }
`;

// search for users
export const SEARCH_USERS = gql`
  query searchUsers($searchTerm: String!) {
    searchUsers(searchTerm: $searchTerm) {
      _id
      username
    }
  }
`;

