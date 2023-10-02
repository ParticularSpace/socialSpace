import { gql, useMutation } from "@apollo/client";

export const ADD_USER = gql`
  mutation addUser(
    $username: String!
    $email: String!
    $date_of_birth: String!
    $password: String!
  ) {
    addUser(
      username: $username
      email: $email
      date_of_birth: $date_of_birth
      password: $password
    ) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        email
      }
    }
  }
`;

export const ADD_POST = gql`
  mutation addPost($content: String!, $photo: Upload) {
    addPost(content: $content, photo: $photo) {
      _id
      content
      photo
      createdAt
      user {
        _id
        username
      }
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      _id
      content
      likes {
        _id
        createdAt
        user {
          _id
          username
        }
      }
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation unlikePost($postId: ID!) {
    unlikePost(postId: $postId) {
      _id
      likes {
        _id
        user {
          _id
          username
        }
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment($postId: ID!, $content: String!) {
    addComment(postId: $postId, content: $content) {
      _id
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

export const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      _id
      content
      likes {
        _id
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


export const UPLOAD_AVATAR = gql`
  mutation uploadAvatar($avatar: Upload!) {
    uploadAvatar(avatar: $avatar)
  }
`;

export const UPDATE_PROFILE = gql`
  mutation updateProfile($username: String, $email: String, $profile_picture: Upload) {
    updateProfile(username: $username, email: $email, profile_picture: $profile_picture) {
      _id
      username
      email
      bio
      profile_picture
    }
  }
`;

export const ADD_FRIEND = gql`
  mutation addFriend($friendId: ID!) {
    addFriend(friendId: $friendId) {
      _id
      username
      email
      bio
      profile_picture
    }
  }
`;


export const ACCEPT_FRIEND_REQUEST = gql`
 mutation acceptFriendRequest($friendId: ID!) {
   acceptFriendRequest(friendId: $friendId) {
     _id
     username
     email
     bio
     profile_picture
   }
 }`

export const DECLINE_FRIEND_REQUEST = gql`
  mutation declineFriendRequest($friendId: ID!) {
    declineFriendRequest(friendId: $friendId) {
      _id
      username
      email
      bio
      profile_picture
    }
  }`

export const REMOVE_FRIEND = gql`
  mutation removeFriend($friendId: ID!) {
    removeFriend(friendId: $friendId) {
      _id
      username
      email
      bio
      profile_picture
    }
  }`

