import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query posts {
    posts {
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

