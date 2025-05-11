// This imports the Router tool from Express, which helps us create routes (paths) for our app
import { Router } from 'express';
// This imports our login and register functions from the auth controller file
import { login, register } from '../controllers/auth.controller';

// This creates a new router object that will handle our authentication routes
// Think of it like creating a new section of a map for our app
const router = Router();

// These lines set up our authentication routes
// They tell our app what to do when someone visits these URLs

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login to the social media app
 *     description: Use this endpoint to login with username and password and receive a JWT token
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     fullName:
 *                       type: string
 *                       example: John Doe
 *       400:
 *         description: Missing username or password
 *       401:
 *         description: Invalid credentials
 */
// This creates a route for logging in
// When someone sends a POST request to /login, our login function will handle it
// POST means they're sending data to us (like a username and password)
// The "as any" part is just to make TypeScript happy - it's like saying "trust me on this"
router.post('/login', login as any);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user for the social media app
 *     description: Use this endpoint to create a new user account and receive a JWT token
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *                 example: newuser
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: newpassword
 *               fullName:
 *                 type: string
 *                 description: User's full name (optional)
 *                 example: New User
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 6
 *                     username:
 *                       type: string
 *                       example: newuser
 *                     fullName:
 *                       type: string
 *                       example: New User
 *       400:
 *         description: Missing username or password
 *       409:
 *         description: Username already exists
 */
// This creates a route for registering (signing up)
// When someone sends a POST request to /register, our register function will handle it
// They'll send us a username and password, and we'll create a new account
router.post('/register', register as any);

// This exports our router so it can be used in other files
// It's like saying "here's the map section we created, you can use it in the main map"
export default router;
