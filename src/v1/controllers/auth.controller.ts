// This imports tools we need from Express to handle web requests and responses
import { Request, Response } from 'express';
// This imports the JWT library which helps us create and check special login tokens
// SignOptions is a special type that tells TypeScript what options we can use with JWT
import jwt, { SignOptions } from 'jsonwebtoken';
// This imports our JWT settings from the config file
import { jwtConfig } from '../config/jwt.config';
// This imports functions that help us find and create users
import { findUserByUsername, createUser } from '../models/user.model';

// This creates and exports our login function
// It handles when someone tries to log in to our app
export const login = (req: Request, res: Response) => {
  // This gets the username and password from the request body
  // It's like taking the username and password from a login form
  const { username, password } = req.body;

  // This checks if the username and password were provided
  // It's like making sure someone filled out all the required fields on a form
  if (!username || !password) {
    // If something is missing, we send back an error message with status code 400
    // Status 400 means "Bad Request" - the user did something wrong
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // This tries to find a user with the given username in our user list
  // It's like looking up someone in the school directory
  const user = findUserByUsername(username);

  // This checks if we found a user AND if the password matches
  // It's like checking if the person exists AND if they know the secret password
  if (!user || user.password !== password) {
    // If the user doesn't exist or the password is wrong, we send back an error
    // Status 401 means "Unauthorized" - you're not allowed in
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // If we get here, the login was successful!
  // Now we create a special token (like a VIP pass) for the user
  // This token proves who they are when they visit other parts of our app
  const token = jwt.sign(
    // This is the information we put in the token - the user's ID and username
    // It's like writing their name and ID number on their VIP pass
    { userId: user.id, username: user.username },
    // This is the secret key we use to "sign" (secure) the token
    // It's like using a special stamp that only our app knows about
    jwtConfig.secret,
    // This sets how long the token lasts before it expires
    // It's like saying "this pass is only good for 1 hour"
    { expiresIn: jwtConfig.expiresIn } as SignOptions
  );

  // Now we send back a success message, the token, and some user info
  // It's like saying "Welcome! Here's your VIP pass and your name tag"
  return res.json({
    // This is a friendly message saying login worked
    message: 'Login successful',
    // This is the special token they'll use to prove who they are
    token,
    // This is some basic info about the user (but NOT their password)
    user: {
      id: user.id,
      username: user.username
    }
  });
};

// This creates and exports our register function
// It handles when someone tries to create a new account
export const register = (req: Request, res: Response) => {
  // This gets the username and password from the request body
  // It's like taking the information from a signup form
  const { username, password } = req.body;

  // This checks if the username and password were provided
  // It's like making sure someone filled out all the required fields on a form
  if (!username || !password) {
    // If something is missing, we send back an error message with status code 400
    // Status 400 means "Bad Request" - the user did something wrong
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // This checks if a user with this username already exists
  // It's like checking if the username is already taken
  const existingUser = findUserByUsername(username);
  if (existingUser) {
    // If the username is taken, we send back an error with status code 409
    // Status 409 means "Conflict" - there's a problem with the request
    return res.status(409).json({ message: 'Username already exists' });
  }

  // If we get here, we can create the new user
  // It's like filling out a new student card and adding them to the school
  const newUser = createUser(username, password);

  // Now we create a special token (like a VIP pass) for the new user
  // This token proves who they are when they visit other parts of our app
  const token = jwt.sign(
    // This is the information we put in the token - the user's ID and username
    // It's like writing their name and ID number on their VIP pass
    { userId: newUser.id, username: newUser.username },
    // This is the secret key we use to "sign" (secure) the token
    // It's like using a special stamp that only our app knows about
    jwtConfig.secret,
    // This sets how long the token lasts before it expires
    // It's like saying "this pass is only good for 1 hour"
    { expiresIn: jwtConfig.expiresIn } as SignOptions
  );

  // Now we send back a success message, the token, and some user info
  // It's like saying "Welcome to our app! Here's your VIP pass and your name tag"
  // Status 201 means "Created" - we successfully created something new
  return res.status(201).json({
    // This is a friendly message saying registration worked
    message: 'User registered successfully',
    // This is the special token they'll use to prove who they are
    token,
    // This is some basic info about the user (but NOT their password)
    user: {
      id: newUser.id,
      username: newUser.username
    }
  });
};
