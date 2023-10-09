const { User, Post, Comment, Like } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express'); // Make sure to import this.
const AWS = require('aws-sdk'); // Required for direct S3 operations
const { v4: uuidv4 } = require('uuid');  // for generating unique filenames
// Use the already set-up s3 instance from your s3.js file
const { GraphQLUpload } = require('graphql-upload');
const moderateText = require('../utils/ai/moderateText');
const moderateImage = require('../utils/ai/moderateImage');
const generateFeed = require('../algorithms/feed_generator');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const uploadToS3 = async (fileStream, filename) => {
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: filename,
    Body: fileStream
  };

  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, (error, data) => {
      if (error) {
        reject(new Error('Error uploading image.'));
      }
      resolve(data.Location);
    });
  });
};

const extractHashtags = (text) => {
  const regex = /#(\w+)/g;
  const result = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    result.push(match[1]);
  }
  return result;
};


const resolvers = {
  Query: {
    // WORKS FOR NOW ISH
    userFeed: async (_, { userId }, context) => {
      if (!context.user) {
        throw new Error('Authentication required!');
      }
      let feed = await generateFeed(userId);


      return feed || [];
    },
    getUserPosts: async (_, { userId }, context) => {
    
      if (!context.user) {
        throw new Error('Authentication required!');
      }
     
      const posts = await Post.find({ user: userId }).populate('user').populate('likes').populate('comments');
     
      return posts || [];
    },
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      const userData = await User.findOne({ _id: context.user._id })
        .select('-__v -password')
        .populate('posts')
        .populate('comments');
      return userData || null; // Handle potential null values
    },
    users: async () => {
      const usersList = await User.find()
        .select('-__v -password')
        .populate('posts')
        .populate('comments');
      return usersList || []; // Ensure we return an empty array if there are no users
    },
    user: async (parent, { username }) => {
      const user = await User.findOne({ username })
        .select('-__v -password')
        .populate('posts')
        .populate('comments')
        .populate('followers')
        .populate('following');
      if (!user) {
        throw new Error(`User with username ${username} not found!`);
      }
      return user;
    },
    
    post: async (parent, { _id }) => {
      const post = await Post.findById(_id)
        .populate({
          path: 'likes',
          match: { createdAt: { $exists: true } }
        })
        .populate('likes.user')
        .populate('user')
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            model: 'User'
          }
        });

      if (!post) {
        throw new Error(`Post with ID ${_id} not found!`);
      }

      // Ensure each like and comment has necessary fields
      post.likes = post.likes.filter(like => like.createdAt);
      post.comments = post.comments.filter(comment => comment.content && comment.user);

      return post;
    },
    posts: async (parent, { username }) => {
      let query = {};

      if (username) {
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error(`User with username ${username} not found!`);
        }
        query = { user: user._id };
      }

      const postsList = await Post.find(query)
        .populate({
          path: 'likes',
          match: { createdAt: { $exists: true } }  // Only populate likes that have a createdAt
        })
        .populate({ path: 'likes.user' })
        .populate({ path: 'user' })
        .populate({ path: 'comments' })  // Populating comments
        .populate({ path: 'comments.user' });  // Populating user of each comment

      return postsList || []; // Ensure we return an empty array if there are no posts
    },
    comments: async (parent, { username }) => {
      try {
        // Find comments by the given username
        const userComments = await Comment.find({ username: username });

        

        return userComments || [];
      } catch (error) {
        throw new Error(`Failed to fetch comments for username: ${username}. Error: ${error.message}`);
      }


    },
    likes: async (parent, { username }) => {


      try {
        // Fetch the user first
        const user = await User.findOne({ username: username });


        if (!user) {
          throw new Error(`User not found with username: ${username}`);
        }

        // Find likes by the user's ID
        const userLikes = await Like.find({ user: user._id }).populate('post').populate('user');

        return userLikes || [];
      } catch (error) {
        throw new Error(`Failed to fetch likes for username: ${username}. Error: ${error.message}`);
      }
    },
    like: async (_, { postId }, context) => {

      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to like a post');
      }

      // Check if the user has already liked this post
      const existingLike = await Like.findOne({ post: postId, user: context.user._id });

      if (existingLike) {
        throw new Error('You have already liked this post');
      }

      // Create a new like
      const newLike = new Like({
        post: postId,
        user: context.user._id,
      });

      await newLike.save();

      return newLike;  // If needed, otherwise you can return a simple message or the updated post
    },
    // Friends section
    getFriends: async (_, __, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      const user = await User.findById(context.user._id)
        .populate('friends')
        .populate('friendRequests')
        .populate('sentRequests');

      return user.friends;
    },
    getFollowers: async (_, __, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      const user = await User.findById(context.user._id)
        .populate('followers');

      return user.followers;
    },
    getFollowing: async (_, __, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      const user = await User.findById(context.user._id)
        .populate('following');

      return user.following;
    },
    searchUsers: async (_, { searchTerm }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
    
      const users = await User.find({ username: { $regex: searchTerm, $options: 'i' } })
        .select('_id username');
    
      return users;
    },
    


  },
  Upload: GraphQLUpload,
  Mutation: {



    // WORKS FOR NOW DONT TOUCH

    addUser: async (parent, { username, email, password }) => {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
          throw new Error('User with this email or username already exists.');
        }
    
        const user = await User.create({ username, email, password });
        const token = signToken(user);
    
        return { token, user };
      } catch (error) {
        console.error(error);
        throw new Error('Failed to create the user.');
      }
    },
    login: async (parent, { email, password }) => {

      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addPost: async (_, { content, photo }, context) => {
     

      let photoUrl;
      if (context.user) {
        const hashtags = extractHashtags(content);
       

        const moderatedContent = await moderateText(content);

        if (moderatedContent === "0") {
          throw new Error('Your post contains inappropriate content.');
          return;
        }
        

        // Handle the photo upload if it exists
        if (photo) {

          const photoDetails = await photo;
          

          // Check if createReadStream exists in photoDetails, and if it's a function
          if (typeof photoDetails.createReadStream !== "function") {
            console.error("createReadStream is not a function on photoDetails!");
            throw new Error('createReadStream is not available on the photo object.');
          }

          const fileStream = photoDetails.createReadStream();
          const uniqueFilename = uuidv4() + "-" + photoDetails.filename;

          try {
            photoUrl = await uploadToS3(fileStream, uniqueFilename);

            const isSafe = await moderateImage(photoUrl);

            if (isSafe === false) {
              return new Error('Your post contains inappropriate content.');

            }


          } catch (error) {
            console.error("Error uploading to S3:", error);
            throw new Error('Error uploading image to S3.');
          }
        }


        const post = await Post.create({
          content,
          photo: photoUrl,
          user: context.user._id,
          hashtags // `hashtags: hashtags`
        });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { posts: post._id } },
          { new: true }
        );
        
        return post;
      }

    },
    likePost: async (_, { postId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to like a post');
      }


      const alreadyLiked = await Like.findOne({ post: postId, user: context.user._id });

      if (alreadyLiked) {
        console.warn('User has already liked this post'); // Logging for debugging purposes.
        const post = await Post.findById(postId);
        return post; // Return the post without changes.
      }

      const newLike = new Like({ post: postId, user: context.user._id });



      await newLike.save();



      // Here, limit the populated fields to only what's necessary.
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: newLike._id } },
        { new: true }
      )
        .populate('likes')
        .populate({ path: 'likes.user' })  // If you need user details for each like.
        .populate({ path: 'user' });       // If you need user details of the post owner.



      if (updatedPost && updatedPost.hashtags && updatedPost.hashtags.length) {
        await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { interests: { $each: updatedPost.hashtags } } },
          { new: true }
        );
      }

      return updatedPost;
    },
    unlikePost: async (_, { postId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to unlike a post');
      }

      const like = await Like.findOneAndDelete({ post: postId, user: context.user._id });

      if (!like) {
        throw new Error('You haven\'t liked this post yet');
      }

      const updatedPost = await Post.findById(postId);

      if (!updatedPost) {
        throw new Error('Post not found');
      }

      // Remove the post's hashtags from the user's interests
      await User.findByIdAndUpdate(
        context.user._id,
        { $pullAll: { interests: updatedPost.hashtags } },
        { new: true }
      );

      // Update the likes on the post
      await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: like._id } },
        { new: true }
      )
        .populate('likes')
        .populate({ path: 'likes.user' }); // <-- populate the user for each like

      return updatedPost;
    },
    addComment: async (_, { postId, content }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to comment on a post');
      }

      const moderatedContentComment = await moderateText(content);

      if (moderatedContentComment === "0") {
        throw new Error('Your post contains inappropriate content.');
        return;
      }




      const newComment = new Comment({
        content: content,
        post: postId,
        user: context.user._id
      });

      try {
        await newComment.save();

        const postWithComments = await Post.findByIdAndUpdate(
          postId,
          { $push: { comments: newComment._id } },
          {
            new: true,
            populate: {
              path: 'comments',
              model: 'Comment',
              populate: {
                path: 'user',
                model: 'User'
              }
            }
          }
        );

        if (!postWithComments) {
          throw new Error('Post not found');
        }

        return postWithComments;

      } catch (error) {
        console.error('Error saving the comment:', error);
        throw new Error('There was an issue adding the comment. Please try again later.');
      }
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      // You can use Promise.all to fetch comment and post concurrently
      const [comment, post] = await Promise.all([
        Comment.findById(commentId),
        Post.findById(postId)
      ]);

      if (!comment) {
        throw new Error('Comment not found');
      }
      if (!post) {
        throw new Error('Post not found');
      }

      const currentUserId = context.user._id.toString();
      const postUserId = post.user.toString();
      const commentUserId = comment.user.toString();

      if (commentUserId !== currentUserId && postUserId !== currentUserId) {
        throw new AuthenticationError('You can only delete comments that you posted or on your own posts.');
      }

      await Comment.findByIdAndDelete(commentId);

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { comments: commentId } },
        {
          new: true,
          populate: {
            path: 'comments',
            model: 'Comment',
            populate: {
              path: 'user',
              model: 'User'
            }
          }
        }
      );

      return updatedPost;
    },
    updateProfile: async (_, { username, email, bio, profile_picture }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to update your profile');
      }

      const update = {};

      if (username) {
        update.username = username;
      }

      if (email) {
        update.email = email;
      }

      if (bio) {
        update.bio = bio;
      }

      if (profile_picture) {
        const photoDetails = await profile_picture;
        const fileStream = photoDetails.createReadStream();
        const uniqueFilename = uuidv4() + "-" + photoDetails.filename;

        try {
          const photoUrl = await uploadToS3(fileStream, uniqueFilename);
          update.profile_picture = photoUrl;
        } catch (error) {
          console.error("Error uploading to S3:", error);
          throw new Error('Error uploading image to S3.');
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        update,
        { new: true }
      );

      return updatedUser;
    },
    uploadAvatar: async (_, { avatar }, user) => {
      if (!user) {
        throw new AuthenticationError('You need to be logged in!');
      }
    
      if (!avatar) {
        throw new Error('Please provide an image file.');
      }
    
      const avatarDetails = await avatar;
      const fileStream = avatarDetails.createReadStream();
      const uniqueFilename = uuidv4() + '-' + avatarDetails.filename;
    
      try {
        const avatarUrl = await uploadToS3(fileStream, uniqueFilename);
        
    
        const updatedUser = await User.findByIdAndUpdate(
          { _id: user.user._id.toString() },
          { profile_picture: avatarUrl },
          { new: true }
        );
    
        if (!updatedUser) {
          throw new Error("User not found or update failed.");
        }
    
        
    
      } catch (error) {
        console.error('Error:', error);
        throw new Error('Error during the operation.');
      }
    },
    deletePost: async (parent, { postId }, context) => {
      if (context.user) {
        const post = await Post.findByIdAndDelete({ _id: postId });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { posts: post._id } },
          { new: true }
        );

        return post;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    // Friends mutation section
    addFriend: async (_, { friendId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      const friend = await User.findById(friendId);

      if (!friend) {
        throw new Error('Friend not found!');
      }

      // Add friend to the current user's friendRequests
      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $addToSet: { friendRequests: friend._id } },
        { new: true }
      );

      // Add current user to the friend's sentRequests
      await User.findByIdAndUpdate(
        { _id: friend._id },
        { $addToSet: { sentRequests: context.user._id } },
        { new: true }
      );

      return friend;
    },
    acceptFriendRequest: async (_, { friendId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      const friend = await User.findById(friendId);

      if (!friend) {
        throw new Error('Friend not found!');
      }

      // Add friend to the current user's friends
      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $addToSet: { friends: friend._id } },
        { new: true }
      );

      // Add current user to the friend's friends
      await User.findByIdAndUpdate(
        { _id: friend._id },
        { $addToSet: { friends: context.user._id } },
        { new: true }
      );

      // Remove friend from the current user's friendRequests
      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { friendRequests: friend._id } },
        { new: true }
      );

      // Remove current user from the friend's sentRequests
      await User.findByIdAndUpdate(
        { _id: friend._id },
        { $pull: { sentRequests: context.user._id } },
        { new: true }
      );

      return friend;
    },
    declineFriendRequest: async (_, { friendId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      const friend = await User.findById(friendId);

      if (!friend) {
        throw new Error('Friend not found!');
      }

      // Remove friend from the current user's friendRequests
      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { friendRequests: friend._id } },
        { new: true }
      );

      // Remove current user from the friend's sentRequests
      await User.findByIdAndUpdate(
        { _id: friend._id },
        { $pull: { sentRequests: context.user._id } },
        { new: true }
      );

      return friend;
    },
    removeFriend: async (_, { friendId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      const friend = await User.findById(friendId);

      if (!friend) {
        throw new Error('Friend not found!');
      }

      // Remove friend from the current user's friends
      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { friends: friend._id } },
        { new: true }
      );

      // Remove current user from the friend's friends
      await User.findByIdAndUpdate(
        { _id: friend._id },
        { $pull: { friends: context.user._id } },
        { new: true }
      );

      return friend;
    },


  },
};


module.exports = resolvers;