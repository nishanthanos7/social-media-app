// This file contains the controller functions for user-related operations
// Controllers handle the logic between the routes and the models

import { Request, Response } from 'express';
import {
  findUserById,
  getUserFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getPublicUserData
} from '../models/user.model';

// Get a user by their ID
export const getUserById = (req: Request, res: Response) => {
  // Get the user ID from the URL parameter and convert it to a number
  const userId = parseInt(req.params.id);

  // Find the user in our database
  const user = findUserById(userId);

  // If user not found, return a 404 error
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Return the public user data (excluding sensitive information like password)
  res.json(getPublicUserData(user));
};

// Get a user's profile (more detailed information)
export const getUserProfile = (req: Request, res: Response) => {
  // Get the user ID from the URL parameter and convert it to a number
  const userId = parseInt(req.params.id);

  // Find the user in our database
  const user = findUserById(userId);

  // If user not found, return a 404 error
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Get the user's friends
  const friends = getUserFriends(userId);

  // Map friends to just their public data
  const friendsData = friends.map(friend => getPublicUserData(friend));

  // Return the user profile with friends data
  res.json({
    ...getPublicUserData(user),
    friends: friendsData
  });
};

// Get a user's friends
export const getFriends = (req: Request, res: Response) => {
  // Get the user ID from the URL parameter and convert it to a number
  const userId = parseInt(req.params.id);

  // Find the user in our database
  const user = findUserById(userId);

  // If user not found, return a 404 error
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Get the user's friends
  const friends = getUserFriends(userId);

  // Map friends to just their public data
  const friendsData = friends.map(friend => getPublicUserData(friend));

  // Return the friends data
  res.json(friendsData);
};

// Send a friend request to another user
export const sendFriendRequestController = (req: Request, res: Response) => {
  // Get the authenticated user's ID from the JWT token
  const fromUserId = req.user.userId;

  // Get the target user ID from the URL parameter
  const toUserId = parseInt(req.params.id);

  // Check if trying to send request to self
  if (fromUserId === toUserId) {
    return res.status(400).json({ message: 'Cannot send friend request to yourself' });
  }

  // Try to send the friend request
  const success = sendFriendRequest(fromUserId, toUserId);

  if (!success) {
    return res.status(400).json({
      message: 'Failed to send friend request. User may not exist or request already sent.'
    });
  }

  res.json({ message: 'Friend request sent successfully' });
};

// Accept a friend request
export const acceptFriendRequestController = (req: Request, res: Response) => {
  // Get the authenticated user's ID from the JWT token
  const userId = req.user.userId;

  // Get the friend ID from the URL parameter
  const friendId = parseInt(req.params.id);

  // Try to accept the friend request
  const success = acceptFriendRequest(userId, friendId);

  if (!success) {
    return res.status(400).json({
      message: 'Failed to accept friend request. Request may not exist.'
    });
  }

  res.json({ message: 'Friend request accepted successfully' });
};

// Get pending friend requests for the authenticated user
export const getFriendRequests = (req: Request, res: Response) => {
  // Get the authenticated user's ID from the JWT token
  const userId = req.user.userId;

  // Find the user in our database
  const user = findUserById(userId);

  // If user not found, return a 404 error
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // If user has no friend requests, return empty array
  if (!user.friendRequests || user.friendRequests.length === 0) {
    return res.json([]);
  }

  // Get the users who sent friend requests
  const requesters = user.friendRequests.map(id => {
    const requester = findUserById(id);
    return requester ? getPublicUserData(requester) : null;
  }).filter(Boolean); // Remove any null values

  // Return the requesters data
  res.json(requesters);
};
