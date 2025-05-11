// This imports tools we need from Express to handle web requests, responses, and middleware
import { Request, Response, NextFunction } from 'express';
// This imports the JWT library which helps us check tokens
// VerifyOptions is a special type that tells TypeScript what options we can use with JWT verification
import jwt, { VerifyOptions } from 'jsonwebtoken';
// This imports our JWT settings from the config file
import { jwtConfig } from '../config/jwt.config';

// This adds a new property to Express's Request type
// It's like telling TypeScript "Hey, we're going to add a 'user' property to requests"
// This is special code that changes how TypeScript understands our app
declare global {
  namespace Express {
    interface Request {
      // This says requests can have a user property that can be any type
      // It's like adding a special pocket to a backpack to hold user information
      user?: any;
    }
  }
}

// This creates and exports our authentication middleware function
// Middleware is like a security guard that checks people before they enter a restricted area
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // This gets the Authorization header from the request
  // The Authorization header is where the token is sent
  // It's like looking for someone's ID card in their pocket
  const authHeader = req.headers['authorization'];

  // This extracts just the token part from the header
  // The header format is "Bearer TOKEN", so we split it and take the second part
  // It's like taking just the ID card out of its holder
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format

  // This checks if a token was provided
  // It's like checking if someone actually has an ID card
  if (!token) {
    // If no token was provided, we send back an error with status code 401
    // Status 401 means "Unauthorized" - you need to log in first
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  try {
    // This verifies that the token is valid and hasn't been tampered with
    // It's like checking if an ID card is real and not fake
    const decoded = jwt.verify(token, jwtConfig.secret);

    // If the token is valid, we add the user information from the token to the request
    // This lets the route handlers know who the user is
    // It's like putting a name tag on someone after checking their ID
    req.user = decoded;

    // This tells Express to continue to the next step (the route handler)
    // It's like the security guard saying "You're good to go!" and letting you pass
    next();
  } catch (error) {
    // If the token is invalid (fake or expired), we send back an error with status code 403
    // Status 403 means "Forbidden" - your ID card is no good here
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
