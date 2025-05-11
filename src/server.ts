// This is the main server file for our social media application
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Import v1 router
import v1Router from './v1/index';

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();

// Set the port for our server (use environment variable or default to 3000)
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// Define Swagger options for the Social Media API
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Social Media API',
      version: '1.0.0',
      description: 'A simple social media API with user profiles, posts, comments, and friend connections.',
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

// Set up Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    docExpansion: 'list',
    defaultModelsExpandDepth: 0
  },
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Social Media API Documentation'
}));

// Create a route to get the Swagger documentation as a JSON file
app.get('/swagger.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Mount the v1 API routes
app.use('/api/v1', v1Router);

// Redirect root to the API docs for convenience
app.get('/', (_req, res) => {
  res.redirect('/api-docs');
});

// Add a welcome message for the API
app.get('/welcome', (_req, res) => {
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Social Media API Documentation available at http://localhost:${PORT}/api-docs`);
});
