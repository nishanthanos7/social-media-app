// This imports the tools we need from Express to create routes and handle requests/responses
import { Router } from 'express';
// This imports our authentication middleware that checks if users are logged in
import { authenticateToken } from '../middleware/auth.middleware';
// This imports our user controllers that handle the logic for each route
import {
  getUserById,
  getUserProfile,
  getFriends,
  sendFriendRequestController,
  acceptFriendRequestController,
  getFriendRequests
} from '../controllers/users.controller';

// This creates a new router object that will handle our user routes
const router = Router();

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve basic information about a user by their ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: user1
 *       401:
 *         description: Authentication token is required
 *       403:
 *         description: Invalid token or unauthorized access
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticateToken as any, getUserById as any);

/**
 * @swagger
 * /v1/users/{id}/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve detailed profile information for a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Profile information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: user1
 *                 profile:
 *                   type: object
 *                   properties:
 *                     joinDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-05-07T10:00:00Z"
 *                     lastLogin:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-05-07T15:30:00Z"
 *       401:
 *         description: Authentication token is required
 *       403:
 *         description: Invalid token or unauthorized access
 *       404:
 *         description: User not found
 */
router.get('/:id/profile', authenticateToken as any, getUserProfile as any);

/**
 * @swagger
 * /v1/users/{id}/friends:
 *   get:
 *     summary: Get user's friends
 *     description: Retrieve a list of the user's friends
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of friends retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   fullName:
 *                     type: string
 *                   profilePicture:
 *                     type: string
 *       401:
 *         description: Authentication token is required
 *       404:
 *         description: User not found
 */
router.get('/:id/friends', authenticateToken as any, getFriends as any);

/**
 * @swagger
 * /api/v1/users/{id}/friend-request:
 *   post:
 *     summary: Send a friend request
 *     description: Send a friend request to another user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to send request to
 *     responses:
 *       200:
 *         description: Friend request sent successfully
 *       400:
 *         description: Failed to send friend request
 *       401:
 *         description: Authentication token is required
 */
router.post('/:id/friend-request', authenticateToken as any, sendFriendRequestController as any);

/**
 * @swagger
 * /api/v1/users/{id}/accept-friend:
 *   post:
 *     summary: Accept a friend request
 *     description: Accept a friend request from another user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to accept request from
 *     responses:
 *       200:
 *         description: Friend request accepted successfully
 *       400:
 *         description: Failed to accept friend request
 *       401:
 *         description: Authentication token is required
 */
router.post('/:id/accept-friend', authenticateToken as any, acceptFriendRequestController as any);

/**
 * @swagger
 * /api/v1/users/friend-requests:
 *   get:
 *     summary: Get pending friend requests
 *     description: Get a list of pending friend requests for the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of friend requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   fullName:
 *                     type: string
 *                   profilePicture:
 *                     type: string
 *       401:
 *         description: Authentication token is required
 */
router.get('/friend-requests', authenticateToken as any, getFriendRequests as any);

export default router;
