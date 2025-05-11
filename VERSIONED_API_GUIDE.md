# Versioned API Guide

This document explains how to use our versioned JWT Authentication API.

## API Versioning

Our API uses versioning in the URL path to ensure backward compatibility as the API evolves. The current version is `v1`.

## Base URLs

- **Version 1 (Current)**: `http://localhost:3000/v1`
- **Legacy (Same as v1)**: `http://localhost:3000/api`

## Authentication Endpoints

### Register a New User

- **URL**: `POST /v1/auth/register`
- **Description**: Creates a new user account and returns a JWT token
- **Request Body**:
  ```json
  {
    "username": "newuser",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "username": "newuser"
    }
  }
  ```

### Login

- **URL**: `POST /v1/auth/login`
- **Description**: Authenticates a user and returns a JWT token
- **Request Body**:
  ```json
  {
    "username": "user1",
    "password": "password1"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "user1"
    }
  }
  ```

## User Endpoints

### Get User Information

- **URL**: `GET /v1/users/:id`
- **Description**: Retrieves basic information about a user
- **Authentication**: Required (JWT token in Authorization header)
- **URL Parameters**:
  - `id`: The ID of the user to retrieve
- **Response**:
  ```json
  {
    "id": 1,
    "username": "user1"
  }
  ```

### Get User Profile

- **URL**: `GET /v1/users/:id/profile`
- **Description**: Retrieves detailed profile information for a user
- **Authentication**: Required (JWT token in Authorization header)
- **URL Parameters**:
  - `id`: The ID of the user whose profile to retrieve
- **Response**:
  ```json
  {
    "id": 1,
    "username": "user1",
    "profile": {
      "joinDate": "2023-04-07T15:30:00Z",
      "lastLogin": "2023-05-07T15:30:00Z"
    }
  }
  ```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

You can obtain a token by registering or logging in.

## Testing with Postman

### 1. Register a New User

1. Create a new POST request to `http://localhost:3000/v1/auth/register`
2. Set the body to raw JSON:
   ```json
   {
     "username": "testuser",
     "password": "testpassword"
   }
   ```
3. Send the request
4. Save the token from the response

### 2. Login

1. Create a new POST request to `http://localhost:3000/v1/auth/login`
2. Set the body to raw JSON:
   ```json
   {
     "username": "testuser",
     "password": "testpassword"
   }
   ```
3. Send the request
4. Save the token from the response

### 3. Access User Information

1. Create a new GET request to `http://localhost:3000/v1/users/2` (replace "2" with your user ID)
2. Add a header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN` (replace with the token you received)
3. Send the request

### 4. Access User Profile

1. Create a new GET request to `http://localhost:3000/v1/users/2/profile` (replace "2" with your user ID)
2. Add a header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN` (replace with the token you received)
3. Send the request

## API Documentation

You can access the interactive API documentation at:

```
http://localhost:3000/api-docs
```

This Swagger UI provides detailed information about all endpoints, including:
- Request parameters
- Request body schemas
- Response schemas
- Authentication requirements

## Project Structure

Our API follows a versioned directory structure:

```
src/
├── config/
│   ├── jwt.config.ts
│   └── swagger.config.ts
├── v1/
│   ├── config/
│   │   └── jwt.config.ts
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   ├── models/
│   │   └── user.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── users.routes.ts
│   └── index.ts
└── index.ts
```

This structure allows us to:
1. Keep each version's code separate
2. Make changes to newer versions without affecting older ones
3. Maintain backward compatibility
4. Eventually deprecate older versions when needed

## Best Practices for API Consumers

1. Always use the latest version (`/v1`) for new development
2. Include the version in your API requests
3. Store the base URL (including version) as a configuration variable
4. Handle authentication token expiration gracefully
5. Check the API documentation for updates
