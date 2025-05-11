# RESTful API Design Guide

This document explains the API design patterns used in this project and how to use them effectively.

## API Design Principles

Our API follows RESTful design principles, which make it intuitive and easy to use:

1. **Resource-based URLs**: URLs represent resources (nouns), not actions
2. **HTTP methods for actions**: Use HTTP methods (GET, POST, PUT, DELETE) to perform actions on resources
3. **Hierarchical structure**: Resources can have sub-resources, represented in the URL path
4. **Consistent patterns**: Similar resources follow the same patterns
5. **Stateless**: Each request contains all information needed to process it

## API Endpoints

### Authentication

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/auth/register` | POST | Register a new user | `{ "username": "user1", "password": "password1" }` | JWT token and user info |
| `/api/auth/login` | POST | Login with existing user | `{ "username": "user1", "password": "password1" }` | JWT token and user info |

### Users

| Endpoint | Method | Description | Auth Required | Response |
|----------|--------|-------------|---------------|----------|
| `/api/users/:id` | GET | Get basic user information | Yes | User info (id, username) |
| `/api/users/:id/profile` | GET | Get detailed user profile | Yes | User profile with additional details |

## URL Pattern Explanation

### User Resources

The pattern `/api/users/:id` follows RESTful conventions:

- `/api` - API version/namespace
- `/users` - The resource type (collection of users)
- `/:id` - Specific resource identifier (a specific user)

### Sub-resources

The pattern `/api/users/:id/profile` represents a sub-resource:

- `/api/users/:id` - Identifies a specific user
- `/profile` - A sub-resource belonging to that user

This hierarchical structure makes it clear that the profile belongs to a specific user.

## Authentication

All endpoints that access user data require authentication using JWT tokens:

1. First, obtain a token by registering or logging in
2. Include the token in the Authorization header of subsequent requests:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

## Authorization Rules

Our API enforces these authorization rules:

1. Users can only access their own data
2. Attempting to access another user's data will return a 403 Forbidden error

Example: If you're authenticated as user with ID 1, you can access:
- `/api/users/1` - Your own user data
- `/api/users/1/profile` - Your own profile

But you cannot access:
- `/api/users/2` - Another user's data
- `/api/users/2/profile` - Another user's profile

## Testing with Postman

### 1. Register or Login

1. Send a POST request to `/api/auth/register` or `/api/auth/login`
2. Save the JWT token from the response

### 2. Access User Data

1. Create a new request to `/api/users/1` (replace 1 with your user ID)
2. Add an Authorization header: `Bearer YOUR_JWT_TOKEN`
3. Send the request

### 3. Access User Profile

1. Create a new request to `/api/users/1/profile` (replace 1 with your user ID)
2. Add an Authorization header: `Bearer YOUR_JWT_TOKEN`
3. Send the request

## Benefits of This API Design

1. **Intuitive**: The URL structure clearly shows the relationships between resources
2. **Consistent**: Similar resources follow the same patterns
3. **Scalable**: Easy to add new resources and sub-resources
4. **Secure**: Built-in authorization ensures users can only access their own data
5. **Well-documented**: Swagger UI provides interactive documentation

## Future Expansion

This API design can easily be expanded to include more resources and operations:

- `/api/users/:id/posts` - Get posts created by a user
- `/api/users/:id/posts/:postId` - Get a specific post by a user
- `/api/users/:id/friends` - Get a user's friends
- `/api/posts` - Get all posts
- `/api/posts/:id` - Get a specific post
- `/api/posts/:id/comments` - Get comments on a post
