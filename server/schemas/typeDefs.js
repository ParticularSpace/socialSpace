const { gql } = require('apollo-server-express');



const typeDefs = gql`

  scalar Upload

  type User {
    _id: ID!
    username: String
    email: String!
    date_of_birth: String
    profile_picture: String
    bio: String
    interests: [String]
    posts: [Post]
    comments: [Comment]
    likes: [Like]
    friends: [User]
}


  type Post {
    _id: ID!
    content: String!
    photo: String
    user: User
    volume: Int!
    likes: [Like]
    comments: [Comment]
    hashtags: [String]
    createdAt: String!
  }

  type Comment {
    _id: ID!
    content: String!
    post: Post
    user: User!
    createdAt: String
  }
  

  type Like {
    _id: ID!
    user: User
    post: Post!
    createdAt: String!
  }


type Auth {
  token: ID!
  user: User
}

type Query {
  userFeed(userId: ID!): [Post!]!
  getUserPosts(userId: ID!): [Post!]!
  getFriends: [User]
  getFollowers: [User]
  getFollowing: [User]  
  me: User
  users: [User]
  user(username: String!): User
  searchUsers(searchTerm: String!): [User]
  posts(username: String): [Post]
  post(_id: ID!): Post
  comments(postId: ID!): [Comment]
  likes(postId: ID!): [Like]
  like(postId: ID!): Like
}

type Mutation {
  login(email: String!, password: String!): Auth
  addUser(username: String!, email: String!, password: String!): Auth
  addFriend(friendId: ID!): User
  acceptFriendRequest(friendId: ID!): User
  declineFriendRequest(friendId: ID!): User
  removeFriend(friendId: ID!): User
  addPost(content: String!, photo: Upload): Post 
  addComment(postId: ID!, content: String!): Post
  deleteComment(postId: ID!, commentId: ID!): Post
  likePost(postId: ID!): Post
  unlikePost(postId: ID!): Post
  deletePost(postId: ID!): User
  uploadAvatar(avatar: Upload!): Boolean
  uploadCardMedia(cardmedia: Upload!): Boolean
  checkImage(file: Upload!): Boolean
  updateProfile(username: String, email: String, bio: String, profile_picture: Upload): User
}




`;

module.exports = typeDefs;
