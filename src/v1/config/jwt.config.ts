// This imports the dotenv library, which helps us use secret information from a special file
import dotenv from 'dotenv';

// This loads all the secret information from our .env file
// It's like opening a locked diary where we keep important secrets
dotenv.config();

// This creates and exports our JWT (JSON Web Token) settings
// JWT is like a special pass card that proves who you are
export const jwtConfig = {
  // This sets our secret key used to create and check tokens
  // It's like a special password that only our app knows
  // If we don't have one in our .env file, we use a backup one
  secret: process.env.JWT_SECRET || 'fallback_secret_key',

  // This sets how long our tokens last before they expire
  // It's like saying "this pass card works for 1 hour, then you need a new one"
  expiresIn: process.env.JWT_EXPIRES_IN || '1h'
};
