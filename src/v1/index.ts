// This file sets up all the routes for API version 1
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import postsRoutes from './routes/posts.routes';

// Define Swagger options for v1 API
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Social Media API',
      version: '1.0.0',
      description: 'A simple social media API with JWT authentication, user profiles, posts, comments, and friend connections.',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'API endpoints for user authentication (login/register)'
      },
      {
        name: 'Users',
        description: 'API endpoints for user data, profiles, and friend connections'
      },
      {
        name: 'Posts',
        description: 'API endpoints for creating and interacting with posts'
      }
    ],
    paths: {},
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/v1/routes/*.ts', './src/v1/models/*.ts'] // Scan route and model files for JSDoc annotations
};

// Generate Swagger specification
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Create a router for version 1 of the API
const v1Router = Router();

// Set up Swagger documentation
v1Router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Create a route to get the Swagger documentation as a JSON file
v1Router.get('/swagger.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Mount the authentication routes
v1Router.use('/auth', authRoutes);

// Mount the user routes
v1Router.use('/users', usersRoutes);

// Mount the posts routes
v1Router.use('/posts', postsRoutes);

// Add a welcome message for the API
v1Router.get('/welcome', (_req, res) => {
  res.json({
    message: 'Welcome to the Social Media API',
    documentation: 'Visit /api-docs for interactive API documentation',
    swagger_json: '/swagger.json',
    endpoints: {
      auth: {
        login: 'POST /api/v1/auth/login',
        register: 'POST /api/v1/auth/register'
      },
      users: {
        getUserById: 'GET /api/v1/users/:id',
        getUserProfile: 'GET /api/v1/users/:id/profile',
        getUserFriends: 'GET /api/v1/users/:id/friends',
        sendFriendRequest: 'POST /api/v1/users/:id/friend-request',
        acceptFriendRequest: 'POST /api/v1/users/:id/accept-friend',
        getFriendRequests: 'GET /api/v1/users/friend-requests'
      },
      posts: {
        getFeed: 'GET /api/v1/posts/feed',
        createPost: 'POST /api/v1/posts',
        getPostById: 'GET /api/v1/posts/:id',
        getUserPosts: 'GET /api/v1/posts/user/:id',
        likePost: 'POST /api/v1/posts/:id/like',
        unlikePost: 'POST /api/v1/posts/:id/unlike',
        getComments: 'GET /api/v1/posts/:id/comments',
        addComment: 'POST /api/v1/posts/:id/comments'
      }
    }
  });
});

export default v1Router;
