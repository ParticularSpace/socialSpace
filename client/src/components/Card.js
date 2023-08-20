import React, { useState, useRef, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FavoriteBorderTwoToneIcon from "@mui/icons-material/FavoriteBorderTwoTone";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import CardMedia from "@mui/material/CardMedia";
import ShareTwoToneIcon from "@mui/icons-material/ShareTwoTone";
import placeholder from "./img/in_img.png";
import ChatBubbleTwoToneIcon from "@mui/icons-material/ChatBubbleTwoTone";
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
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
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








  const dynamicHeight = showComments
    ? post.photo
      ? "93vh" // comments and a photo
      : "66vh" // comments but no photo
    : post.photo
      ? "53vh" // no comments but there is a photo
      : "23vh"; // no comments and no photo

  return (
    <div className="Car">
      <Card
        color="dark"
        style={{
          position: "relative",
          backgroundColor: "rgba(128, 128, 128, 0.6)",
          borderRadius: "15px",
          height: dynamicHeight,
          width: "30vw",
        }}
      >
        {post.photo && (
          <CardMedia
            sx={{ height: "30vh", width: "30vw" }}
            image={post.photo ? post.photo : placeholder}
          />
        )}
        <a
          href="#"
          style={{ position: "absolute", top: "2%", left: "2%", zIndex: 1 }}
        >
          <Avatar alt={post.username} />
        </a>

        <CardContent>
          {/* <div className='Tagz'>
            
            <span style={{ cursor: 'pointer', color: 'white' }}>
              #tag1 #tag2 #tag3
            </span>
          </div> */}

          <div className="Desc">
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {post.username}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {renderContentWithHashtags(post.content)}
            </Typography>

            {/* <IconButton style={{ color: 'blue', borderRadius: '50%' }}>
              <ReadMoreTwoToneIcon />
            </IconButton> */}
          </div>
        </CardContent>

        <CardActions
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-around",
            }}
          >
            <IconButton
              aria-label="like"
              size="small"
              style={{
                borderRadius: "50%",
                color: isLikedByUser ? "red" : "white",
              }}
              onClick={
                isLikedByUser
                  ? () => handleUnlike(post._id)
                  : () => handleLike(post._id)
              }
            >
              <FavoriteBorderTwoToneIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {likesArray.length}
            </Typography>
            <IconButton
              aria-label="comment"
              size="small"
              style={{ borderRadius: "50%", color: "white" }}
              onClick={() => setShowComments(!showComments)} // Toggle the comment section
            >
              <ChatBubbleTwoToneIcon />
            </IconButton>
            <IconButton
              aria-label="share"
              size="small"
              style={{ borderRadius: "50%", color: "white" }}
            >
              <ShareTwoToneIcon />
            </IconButton>
          </div>
          {showComments && (
            <div style={{ width: "100%", height: "50%" }} ref={commentsTopRef}>
              <div
                style={{
                  maxHeight: "180px",
                  maxWidth: "100vw",
                  overflowY: "scroll",
                  borderBottom: "1px solid white",
                }}
              >
                {/* Dynamically render each comment from the post object in reverse order */}
                {[...post.comments].reverse().map((comment, idx, arr) => (
                  <div
                    key={comment._id}
                    style={{ padding: "10px" }}
                    ref={idx === 0 ? commentsEndRef : null} // Add ref to the last comment (which is the first in the reversed array)
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <strong>{comment.user.username}:</strong>{" "}
                        {comment.content}
                      </div>
                      {(currentUser._id === comment.user._id ||
                        currentUser._id === post.user._id) && (
                          <IconButton
                            onClick={() =>
                              handleDeleteComment(post._id, comment._id)
                            }
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                    </div>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      style={{ marginTop: "5px", width: "100vw" }}
                    >
                      {/* Uncomment the following line when you've resolved the date format issue */}
                      {/* {formatDistanceToNow(new Date(comment.createdAt))} ago */}
                    </Typography>
                  </div>
                ))}
              </div>

              {/* Comment input and button section */}
              <div style={{ paddingTop: "10px" }}>
                <TextField
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  label="Add a comment"
                  fullWidth
                />
                <Button
                  onClick={() => handleCommentSubmit(post._id)}
                  color="primary"
                  style={{ marginTop: "5px" }}
                >
                  Post Comment
                </Button>
              </div>
            </div>
          )}
        </CardActions>
      </Card>
    </div>
  );
}
