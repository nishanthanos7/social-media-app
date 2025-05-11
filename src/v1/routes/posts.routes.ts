// This imports the tools we need from Express to create routes
import { Router } from 'express';
// This imports our authentication middleware that checks if users are logged in
import { authenticateToken } from '../middleware/auth.middleware';
// This imports our post controllers that handle the logic for each route
import {
  getFeed,
  getPostById,
  getUserPosts,
  createNewPost,
  likePostController,
  unlikePostController,
  getPostComments,
  addCommentController
} from '../controllers/posts.controller';

// This creates a new router object that will handle our post routes
const router = Router();

/**
 * @swagger
 * /api/v1/posts/feed:
 *   get:
 *     summary: Get user's feed
 *     description: Retrieve posts from the user and their friends for the feed
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Feed retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: Authentication token is required
 *       404:
 *         description: User not found
 */
router.get('/feed', authenticateToken as any, getFeed as any);

/**
 * @swagger
 * /api/v1/posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post with optional image
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the post
 *               imageUrl:
 *                 type: string
 *                 description: URL to an image (optional)
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid post data
 *       401:
 *         description: Authentication token is required
 */
router.post('/', authenticateToken as any, createNewPost as any);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   get:
 *     summary: Get post by ID
 *     description: Retrieve a specific post by its ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Authentication token is required
 *       404:
 *         description: Post not found
 */
router.get('/:id', authenticateToken as any, getPostById as any);

/**
 * @swagger
 * /v1/posts/user/{id}:
 *   get:
 *     summary: Get posts by user ID
 *     description: Retrieve all posts created by a specific user
 *     tags: [Posts]
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
 *         description: Posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: Authentication token is required
 *       404:
 *         description: User not found
 */
router.get('/user/:id', authenticateToken as any, getUserPosts as any);

/**
 * @swagger
 * /api/v1/posts/{id}/like:
 *   post:
 *     summary: Like a post
 *     description: Add the authenticated user's like to a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post liked successfully
 *       400:
 *         description: Failed to like post
 *       401:
 *         description: Authentication token is required
 */
router.post('/:id/like', authenticateToken as any, likePostController as any);

/**
 * @swagger
 * /v1/posts/{id}/unlike:
 *   post:
 *     summary: Unlike a post
 *     description: Remove the authenticated user's like from a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *       400:
 *         description: Failed to unlike post
 *       401:
 *         description: Authentication token is required
 */
router.post('/:id/unlike', authenticateToken as any, unlikePostController as any);

/**
 * @swagger
 * /v1/posts/{id}/comments:
 *   get:
 *     summary: Get post comments
 *     description: Retrieve all comments for a specific post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Authentication token is required
 *       404:
 *         description: Post not found
 */
router.get('/:id/comments', authenticateToken as any, getPostComments as any);

/**
 * @swagger
 * /v1/posts/{id}/comments:
 *   post:
 *     summary: Add a comment
 *     description: Add a new comment to a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the comment
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid comment data
 *       401:
 *         description: Authentication token is required
 */
router.post('/:id/comments', authenticateToken as any, addCommentController as any);

export default router;
