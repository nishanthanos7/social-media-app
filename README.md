# JWT Authentication Example

A simple Express.js API with TypeScript that demonstrates JWT authentication.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Public Endpoints

- `GET /` - Basic API info
- `POST /api/auth/register` - Register a new user
  - Body: `{ "username": "user1", "password": "password1" }`
- `POST /api/auth/login` - Login and get JWT token
  - Body: `{ "username": "user1", "password": "password1" }`

### Protected Endpoints (Require JWT Token)

- `GET /api/profile` - Get user profile
  - Header: `Authorization: Bearer YOUR_JWT_TOKEN`

## Testing with Postman

1. **Register a new user**:
   - Method: POST
   - URL: `http://localhost:3000/api/auth/register`
   - Body (JSON): `{ "username": "testuser", "password": "testpassword" }`

2. **Login with the user**:
   - Method: POST
   - URL: `http://localhost:3000/api/auth/login`
   - Body (JSON): `{ "username": "testuser", "password": "testpassword" }`
   - The response will include a JWT token

3. **Access protected route**:
   - Method: GET
   - URL: `http://localhost:3000/api/profile`
   - Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
   - Replace `YOUR_JWT_TOKEN` with the token received from the login response

## JWT Flow Explanation

1. **Registration**: User creates an account
2. **Login**: User provides credentials and receives a JWT token
3. **Accessing Protected Routes**: User includes the JWT token in the Authorization header
4. **Token Verification**: The server verifies the token before allowing access to protected resources

## Notes

- This is a minimal example for learning purposes
- In a production environment, you would:
  - Store users in a database
  - Hash passwords
  - Use HTTPS
  - Implement refresh tokens
  - Add more validation and error handling
