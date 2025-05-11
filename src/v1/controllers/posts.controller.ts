// This file contains the controller functions for post-related operations
// Controllers handle the logic between the routes and the models

import { Request, Response } from 'express';
import {
  findPostById,
  getPostWithUserInfo,
  getPostsByUserId,
  getFeedPosts,
  createPost,
  likePost,
  unlikePost,
  getCommentsByPostId,
  addComment
} from '../models/post.model';
import { findUserById } from '../models/user.model';

// Get all posts for a user's feed (their posts + friends' posts)
export const getFeed = (req: Request, res: Response) => {
  // Get the authenticated user's ID from the JWT token
  const userId = req.user.userId;

  // Find the user in our database
  const user = findUserById(userId);

  // If user not found, return a 404 error
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Get the user's friends IDs (or empty array if no friends)
  const friendIds = user.friends || [];

  // Get posts for the feed (user's posts + friends' posts)
  const feedPosts = getFeedPosts(userId, friendIds);

  // Return the feed posts
  res.json(feedPosts);
};

// Get a specific post by ID
export const getPostById = (req: Request, res: Response) => {
  // Get the post ID from the URL parameter
  const postId = parseInt(req.params.id);

  // Find the post in our database with user information
  const post = getPostWithUserInfo(postId);

  // If post not found, return a 404 error
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Return the post
  res.json(post);
};

// Get all posts by a specific user
export const getUserPosts = (req: Request, res: Response) => {
  // Get the user ID from the URL parameter
  const userId = parseInt(req.params.id);

  // Find the user in our database
  const user = findUserById(userId);

  // If user not found, return a 404 error
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Get all posts by this user
  const userPosts = getPostsByUserId(userId);

  // Sort by creation date (newest first)
  userPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Return the user's posts
  res.json(userPosts);
};

// Create a new post
export const createNewPost = (req: Request, res: Response) => {
  // Get the authenticated user's ID from the JWT token
  const userId = req.user.userId;

  // Get the post content and optional image URL from the request body
  const { content, imageUrl } = req.body;

  // Validate the content
  if (!content || content.trim() === '') {
    return res.status(400).json({ message: 'Post content is required' });
  }

  // Create the new post
  const newPost = createPost(userId, content, imageUrl);

  // Return the created post
  res.status(201).json(newPost);
};

// Like a post
export const likePostController = (req: Request, res: Response) => {
  // Get the authenticated user's ID from the JWT token
  const userId = req.user.userId;

  // Get the post ID from the URL parameter
  const postId = parseInt(req.params.id);

  // Try to like the post
  const success = likePost(postId, userId);

  if (!success) {
    return res.status(400).json({
      message: 'Failed to like post. Post may not exist or you already liked it.'
    });
  }

  res.json({ message: 'Post liked successfully' });
};

// Unlike a post
export const unlikePostController = (req: Request, res: Response) => {
  // Get the authenticated user's ID from the JWT token
  const userId = req.user.userId;

  // Get the post ID from the URL parameter
  const postId = parseInt(req.params.id);

  // Try to unlike the post
  const success = unlikePost(postId, userId);

  if (!success) {
    return res.status(400).json({
      message: 'Failed to unlike post. Post may not exist or you haven\'t liked it.'
    });
  }

  res.json({ message: 'Post unliked successfully' });
};

// Get comments for a post
export const getPostComments = (req: Request, res: Response) => {
  // Get the post ID from the URL parameter
  const postId = parseInt(req.params.id);

  // Find the post in our database
  const post = findPostById(postId);

  // If post not found, return a 404 error
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Get all comments for this post
  const postComments = getCommentsByPostId(postId);

  // Sort by creation date (oldest first, so conversations flow naturally)
  postComments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  // Return the post's comments
  res.json(postComments);
};

// Add a comment to a post
export const addCommentController = (req: Request, res: Response) => {
  // Get the authenticated user's ID from the JWT token
  const userId = req.user.userId;

  // Get the post ID from the URL parameter
  const postId = parseInt(req.params.id);

  // Get the comment content from the request body
  const { content } = req.body;

  // Validate the content
  if (!content || content.trim() === '') {
    return res.status(400).json({ message: 'Comment content is required' });
  }

  // Add the comment
  const newComment = addComment(postId, userId, content);

  if (!newComment) {
    return res.status(400).json({ message: 'Failed to add comment. Post may not exist.' });
  }

  // Return the created comment
  res.status(201).json(newComment);
};
