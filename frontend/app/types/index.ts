// Types for our social media application

// User type
export interface User {
  id: number;
  username: string;
  fullName?: string;
  profilePicture?: string;
  bio?: string;
  friends?: number[];
  createdAt?: string;
}

// Post type
export interface Post {
  id: number;
  userId: number;
  content: string;
  imageUrl?: string | null;
  likes: number[];
  createdAt: string;
  user?: User; // For populated user data
}

// Comment type
export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
  user?: User; // For populated user data
}

// Friend request type
export interface FriendRequest {
  id: number;
  fromUserId: number;
  toUserId: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  fromUser?: User; // For populated user data
}

// Authentication types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
