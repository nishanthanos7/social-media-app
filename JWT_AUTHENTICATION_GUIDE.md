# JWT Authentication Project Guide

## Project Overview

This project demonstrates a simple JWT (JSON Web Token) authentication system using Express.js and TypeScript. It provides a minimal implementation to help understand the core concepts of JWT-based authentication.

## Project Structure

```
jwt-auth-test/
├── src/
│   ├── config/
│   │   └── jwt.config.ts         # JWT configuration (secret key, expiration)
│   ├── controllers/
│   │   └── auth.controller.ts    # Authentication logic (login, register)
│   ├── middleware/
│   │   └── auth.middleware.ts    # JWT verification middleware
│   ├── models/
│   │   └── user.model.ts         # User model and in-memory storage
│   ├── routes/
│   │   ├── auth.routes.ts        # Authentication routes
│   │   └── protected.routes.ts   # Protected routes requiring authentication
│   └── index.ts                  # Main application entry point
├── .env                          # Environment variables
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

## How JWT Authentication Works

### 1. JWT Basics

JSON Web Tokens (JWT) are a compact, URL-safe means of representing claims between two parties. The claims in a JWT are encoded as a JSON object that is digitally signed using a secret key.

A JWT token consists of three parts:
- **Header**: Contains the type of token and the signing algorithm
- **Payload**: Contains the claims (user data and metadata)
- **Signature**: Ensures the token hasn't been tampered with

### 2. Authentication Flow

1. **Registration**:
   - User provides username and password
   - Server creates a new user record
   - Server generates a JWT token containing user information
   - Token is returned to the client

2. **Login**:
   - User provides username and password
   - Server verifies credentials
   - Server generates a JWT token containing user information
   - Token is returned to the client

3. **Accessing Protected Resources**:
   - Client includes the JWT token in the Authorization header
   - Server verifies the token's signature and expiration
   - If valid, the server extracts user information from the token
   - The protected resource is accessed with the user context

## Code Explanation

### 1. JWT Configuration (`src/config/jwt.config.ts`)

```typescript
import dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'fallback_secret_key',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h'
};
```

This file loads the JWT secret key and expiration time from environment variables. The secret key is used to sign and verify tokens, while the expiration time determines how long tokens remain valid.

### 2. User Model (`src/models/user.model.ts`)

```typescript
export interface User {
  id: number;
  username: string;
  password: string; // In a real app, this would be hashed
}

// Mock user database
export const users: User[] = [
  {
    id: 1,
    username: 'user1',
    password: 'password1'
  }
];

export const findUserByUsername = (username: string): User | undefined => {
  return users.find(user => user.username === username);
};

export const findUserById = (id: number): User | undefined => {
  return users.find(user => user.id === id);
};

export const createUser = (username: string, password: string): User => {
  const newUser: User = {
    id: users.length + 1,
    username,
    password
  };
  
  users.push(newUser);
  return newUser;
};
```

This file defines the User interface and provides functions to find and create users. For simplicity, it uses an in-memory array to store users instead of a database.

### 3. Authentication Controller (`src/controllers/auth.controller.ts`)

The authentication controller handles user registration and login:

- **Register**: Creates a new user and generates a JWT token
- **Login**: Verifies credentials and generates a JWT token

Key parts:
```typescript
// Generate JWT token
const token = jwt.sign(
  { userId: user.id, username: user.username },
  jwtConfig.secret,
  { expiresIn: jwtConfig.expiresIn } as SignOptions
);
```

This code creates a JWT token containing the user's ID and username, signed with the secret key and set to expire after the configured time.

### 4. Authentication Middleware (`src/middleware/auth.middleware.ts`)

```typescript
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtConfig.secret);
    
    // Add the decoded user to the request object
    req.user = decoded;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
```

This middleware:
1. Extracts the token from the Authorization header
2. Verifies the token's signature and expiration
3. If valid, adds the decoded user information to the request object
4. If invalid, returns an error response

### 5. Routes

#### Authentication Routes (`src/routes/auth.routes.ts`)

```typescript
import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';

const router = Router();

// Auth routes
router.post('/login', login as any);
router.post('/register', register as any);

export default router;
```

Defines routes for user registration and login.

#### Protected Routes (`src/routes/protected.routes.ts`)

```typescript
import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Protected route that requires authentication
router.get('/profile', authenticateToken as any, (req: Request, res: Response) => {
  // The user data is available in req.user thanks to the authenticateToken middleware
  res.json({
    message: 'Protected route accessed successfully',
    user: req.user
  });
});

export default router;
```

Defines a protected route that requires authentication. The `authenticateToken` middleware verifies the JWT token before allowing access to the route.

### 6. Main Application (`src/index.ts`)

```typescript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import protectedRoutes from './routes/protected.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'JWT Authentication API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

This file sets up the Express application, registers middleware, and defines routes.

## API Endpoints

### Public Endpoints

1. **Home**
   - URL: `GET http://localhost:3000/`
   - Description: Basic API information
   - Response: `{ "message": "JWT Authentication API" }`

2. **Register**
   - URL: `POST http://localhost:3000/api/auth/register`
   - Body: `{ "username": "testuser", "password": "testpassword" }`
   - Description: Creates a new user and returns a JWT token
   - Response:
     ```json
     {
       "message": "User registered successfully",
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "user": {
         "id": 2,
         "username": "testuser"
       }
     }
     ```

3. **Login**
   - URL: `POST http://localhost:3000/api/auth/login`
   - Body: `{ "username": "testuser", "password": "testpassword" }`
   - Description: Authenticates a user and returns a JWT token
   - Response:
     ```json
     {
       "message": "Login successful",
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "user": {
         "id": 2,
         "username": "testuser"
       }
     }
     ```

### Protected Endpoints

1. **User Profile**
   - URL: `GET http://localhost:3000/api/profile`
   - Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
   - Description: Returns the user profile information
   - Response:
     ```json
     {
       "message": "Protected route accessed successfully",
       "user": {
         "userId": 2,
         "username": "testuser",
         "iat": 1683456789,
         "exp": 1683460389
       }
     }
     ```

## Testing with Postman

### 1. Setting Up Postman

1. Download and install Postman from [postman.com](https://www.postman.com/downloads/)
2. Create a new collection for JWT Authentication testing

### 2. Testing Endpoints

#### Register a New User

1. Create a new POST request
2. Set the URL to `http://localhost:3000/api/auth/register`
3. Go to the "Body" tab
4. Select "raw" and "JSON"
5. Enter the request body:
   ```json
   {
     "username": "testuser",
     "password": "testpassword"
   }
   ```
6. Send the request
7. Save the token from the response

#### Login with Existing User

1. Create a new POST request
2. Set the URL to `http://localhost:3000/api/auth/login`
3. Go to the "Body" tab
4. Select "raw" and "JSON"
5. Enter the request body:
   ```json
   {
     "username": "testuser",
     "password": "testpassword"
   }
   ```
6. Send the request
7. Save the token from the response

#### Access Protected Route

1. Create a new GET request
2. Set the URL to `http://localhost:3000/api/profile`
3. Go to the "Headers" tab
4. Add a header with key "Authorization" and value "Bearer YOUR_JWT_TOKEN"
   (Replace YOUR_JWT_TOKEN with the token received from login or register)
5. Send the request
6. You should receive the user profile information

### 3. Understanding the JWT Token

You can decode the JWT token at [jwt.io](https://jwt.io/) to see its contents:

1. Copy the token from a login or register response
2. Paste it into the debugger at jwt.io
3. Examine the decoded header and payload

## Production Considerations

This is a minimal example for learning purposes. In a production environment, you would:

1. **Store users in a database** (e.g., MongoDB, PostgreSQL)
2. **Hash passwords** using bcrypt or Argon2
3. **Use HTTPS** to secure communication
4. **Implement refresh tokens** for better security
5. **Add more validation and error handling**
6. **Use environment variables** for all sensitive information
7. **Add rate limiting** to prevent brute force attacks
8. **Implement logging** for security monitoring

## Conclusion

This project demonstrates the core concepts of JWT authentication in a simple Express.js application. By understanding this implementation, you can build more complex authentication systems for your own applications.
