import React from "react";
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../graphql/queries";
import {
  LIKE_POST,
  UNLIKE_POST,
  ADD_COMMENT,
  DELETE_COMMENT,
} from "../graphql/mutations";
import { GET_POST_BY_ID } from "../graphql/queries";
import gql from "graphql-tag";

// postcard to display posts
export default function PostCard({ post }) {
  const { data, loading, error } = useQuery(GET_ME);
  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const [addComment] = useMutation(ADD_COMMENT);
  const [deleteComment] = useMutation(DELETE_COMMENT);


  const [commentContent, setCommentContent] = React.useState("");
  const [showComments, setShowComments] = React.useState(false);
  const commentsEndRef = React.useRef(null);
  const commentsTopRef = React.useRef(null);

  React.useEffect(() => {
    if (showComments && commentsEndRef.current) {
      console.log("Scrolling to bottom remove this feature later lol ;)");
    }
  }, [showComments]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const currentUser = data.me;
  const likesArray = post.likes || [];
  const isLikedByUser = likesArray.some(
    (like) => like.user && like.user.username === currentUser.username
  );





  const handleCommentSubmit = async (postId) => {

    try {
      await addComment({
        variables: {
          postId,
          content: commentContent,
        },
        update(cache, { data: { addComment: newComment } }) {
          const existingPostData = cache.readQuery({
            query: GET_POST_BY_ID,
            variables: { id: postId },
          });

          if (!existingPostData || !existingPostData.post) {
            return; // Exit if post data is not in the cache
          }



          const updatedPost = {
            ...existingPostData.post,
            comments: [...existingPostData.post.comments, newComment],
          };

          // Write the updated post back to the cache
          cache.writeQuery({
            query: GET_POST_BY_ID,
            variables: { id: postId },
            data: {
              post: updatedPost,
            },
          });
        },
      });

      setCommentContent(""); // Clear the input after successful submission

      // After successfully adding the comment
      if (commentsTopRef.current) {
        commentsTopRef.current.scrollTop = 0;
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment({
        variables: { postId, commentId },

        update: (cache) => {
          const existingPostData = cache.readQuery({
            query: GET_POST_BY_ID,
            variables: { id: postId },
          });

          if (!existingPostData || !existingPostData.post) {
            return; // Exit if post data is not in the cache
          }

          const updatedComments = existingPostData.post.comments.filter(
            (comment) => comment._id !== commentId
          );
          cache.writeQuery({
            query: GET_POST_BY_ID,
            variables: { id: postId },
            data: {
              post: { ...existingPostData.post, comments: updatedComments },
            },
          });
        },
      });
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  function renderContentWithHashtags(content) {
    // Split the content by spaces to check each word
    const words = content.split(/\s+/);

    // Convert words to JSX elements, highlighting hashtags
    return words
      .map((word, index) => {
        if (word.startsWith("#")) {
          return (
            <span key={index} style={{ color: "blue" }}>
              {word}
            </span>
          );
        }
        return word;
      })
      .reduce((acc, word, index) => {
        if (index !== 0) acc.push(" "); // Add space between words
        acc.push(word);
        return acc;
      }, []);
  };

  const handleLike = async (postId) => {
    try {
      await likePost({
        variables: { postId },
        update: (cache, { data: { likePost } }) => {
          console.log("likePost", likePost);

          // This assumes that likePost mutation response contains _id of the post and the updated likes array.
          const updatedPost = likePost;

          // Read the current post from cache
          const cachedPost = cache.readFragment({
            id: `Post:${postId}`,
            fragment: gql`
              fragment PostLikes on Post {
                _id
                likes {
                  _id
                  user {
                    _id
                  }
                }
              }
            `,
          });

          // This will check if the cachedPost was successfully retrieved from cache
          if (!cachedPost) {
            console.error("Post not found in cache.");
            return;
          }

          // Write the updated post back to cache
          cache.writeFragment({
            id: `Post:${postId}`,
            fragment: gql`
              fragment PostLikes on Post {
                _id
                likes {
                  _id
                  user {
                    _id
                  }
                }
              }
            `,
            data: {
              ...cachedPost,
              likes: updatedPost.likes,
            },
          });
        },
      });
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await unlikePost({
        variables: { postId },
        update: (cache, { data: { unlikePost } }) => {
          const cachedPost = cache.readFragment({
            id: `Post:${postId}`,
            fragment: gql`
            fragment PostLikes on Post {
              _id
              likes {
                _id
                user {
                  _id
                }
              }
            }
          `,
          });

          console.log("Like removed successfully");

          if (cachedPost) {

            const updatedLikes = cachedPost.likes.filter(
              (like) => like.user && like.user._id !== currentUser._id
            );

            cache.writeFragment({
              id: `Post:${postId}`,
              fragment: gql`
              fragment PostLikes on Post {
                _id
                likes {
                  _id
                  user {
                    _id
                  }
                }
              }
            `,
              data: {
                ...cachedPost,
                likes: updatedLikes,
              },
            });
          }
        },
      });
    } catch (err) {
      console.error("Error unliking post:", err);
    }
  };

  console.log("Post object:", post);

  return (
    <div className="relative bg-gray-200 rounded-lg w-full md:w-[600px] h-auto border-2 border-gray-400 m-4">
      {/* Profile Header Section */}
      <div className="bg-white p-2 flex rounded-lg items-center">
        <img className="w-10 md:w-14 h-10 md:h-14 rounded-full" alt={post.user.username} src={post.user.profile_picture} />
        <div className="ml-2 md:ml-4 flex flex-col">
          <h1 className="text-gray-700 text-sm md:text-lg font-semibold">{post.user.username}</h1>
        </div>
      </div>
  
      {/* Conditional layout based on the presence of an image */}
      {post.photo ? (
        <>
          {/* Post Image */}
          <img
            className="h-40 md:h-[400px] w-full object-cover"
            src={post.photo ? post.photo : null}
            alt="Post"
          />
          {/* Post Content */}
          <div className="p-2 md:p-6">
            <p className="text-sm md:text-md text-gray-700">
              {renderContentWithHashtags(post.content)}
            </p>
          </div>
        </>
      ) : (
        <div className="p-2 md:p-6 flex flex-col items-center justify-center">
          {/* Post Content */}
          <p className="text-sm md:text-xl text-gray-700 mb-2 text-center">
            {renderContentWithHashtags(post.content)}
          </p>
        </div>
      )}
      {/* Caption Section */}
      {post.caption && <p className="text-sm text-gray-500">{post.caption}</p>}

      {/* Timestamp Section */}
      <p className="text-xs text-gray-400 px-4">
        {new Date(Number(post.createdAt)).toString() !== 'Invalid Date'
          ? formatDistanceToNow(new Date(Number(post.createdAt))) + ' ago'
          : 'Invalid Date'
        }
      </p>



      <div className="flex flex-col items-center justify-center p-4">
        <div className="flex items-center w-full justify-between">
          {/* Heart and Like Counter */}
          <div className="flex items-center space-x-2">
            <button
              className={`w-8 h-8 rounded-full ${isLikedByUser ? 'text-red-600' : 'text-gray-400'}`}
              onClick={isLikedByUser ? () => handleUnlike(post._id) : () => handleLike(post._id)}
            >
              {isLikedByUser ? '❤️' : '🤍'}
            </button>
            <p className="text-sm text-gray-600">{likesArray.length}</p>
          </div>
          {/* Rest of the Buttons */}
          <div className="flex items-center space-x-2">
            <button
              className="w-8 h-8 rounded-full text-white"
              onClick={() => setShowComments(!showComments)}
            >
              💬
            </button>
            <p className="text-sm text-gray-600">{post.comments.length}</p>
          </div>
          <button className="w-8 h-8 rounded-full text-white">
            🔄
          </button>
          {/* Save Post Button */}
          <button className="w-8 h-8 rounded-full text-white">
            💾
          </button>
        </div>
      </div>

      {
        showComments && (
          <div className="w-full h-[50%] overflow-y-auto border-t border-gray-300">
            <div className="p-2" ref={commentsTopRef}>
              {post.comments.map((comment, idx) => (
                <div
                  key={comment._id}
                  className="p-2 border-b border-gray-200 relative flex flex-wrap" // Add 'flex-wrap' for responsiveness
                  ref={idx === 0 ? commentsEndRef : null}
                  id={comment._id}
                >

                  {/* Main Content */}
                  <div className="flex-1 flex flex-col items-start justify-start text-left">
                    <strong className="text-sm text-gray-700 block">{comment.user.username}</strong>
                    <p className="text-xs text-gray-600 w-full break-words block mt-1 text-left">{comment.content}</p>
                  </div>


                  {/* Side Content */}
                  <div className="flex flex-col items-end ml-4"> {/* Added 'ml-4' for spacing */}
                    <p className="text-xs text-gray-400">
                      {new Date(Number(comment.createdAt)).toString() !== 'Invalid Date'
                        ? formatDistanceToNow(new Date(Number(comment.createdAt))) + ' ago'
                        : 'Invalid Date'
                      }
                    </p>
                    {(currentUser._id === comment.user._id || currentUser._id === post.user._id) && (
                      <button
                        className="text-xs text-red-500 mt-2"
                        onClick={() => handleDeleteComment(post._id, comment._id)}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 px-2">
              <input
                className="w-full p-2 rounded border"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Add a comment"
              />
              <button
                className="mt-2 w-full mb-4 bg-blue-500 text-white py-1 px-2 rounded"
                onClick={() => handleCommentSubmit(post._id)}
              >
                Post Comment
              </button>
            </div>
          </div>
        )
      }

    </div >
  );
}