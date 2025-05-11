// User-related types
export interface User {
  id: number;
  username: string;
  fullName: string;
  profilePicture: string;
  coverPhoto?: string;
  bio?: string;
  location?: string;
  education?: {
    school: string;
    degree: string;
    year: string;
  }[];
  work?: {
    company: string;
    position: string;
    year: string;
  }[];
  friends?: number[];
  friendRequests?: number[];
  notifications?: Notification[];
  createdAt: string;
}

export interface Notification {
  id: number;
  type: 'FRIEND_REQUEST' | 'POST_LIKE' | 'COMMENT' | 'SHARE';
  fromUserId: number;
  entityId?: number;
  read: boolean;
  createdAt: string;
  fromUser?: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  fullName?: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

// Post-related types
export interface Post {
  id: number;
  content: string;
  postType: 'text' | 'image' | 'video' | 'link';
  imageUrl?: string;
  videoUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  linkDescription?: string;
  linkImage?: string;
  privacy: 'public' | 'friends' | 'private';
  location?: string;
  taggedUsers?: number[];
  taggedUsersInfo?: User[];
  userId: number;
  user?: User;
  reactions: {
    like: number[];
    love: number[];
    haha: number[];
    wow: number[];
    sad: number[];
    angry: number[];
  };
  shareCount: number;
  originalPostId?: number;
  originalPost?: Post;
  commentCount: number;
  reactionCount: number;
  createdAt: string;
  updatedAt: string;
}

// Comment-related types
export interface Comment {
  id: number;
  content: string;
  postId: number;
  userId: number;
  parentId?: number;
  taggedUsers?: number[];
  reactions: {
    like: number[];
    love: number[];
  };
  user?: User;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

// Friend-related types
export interface FriendRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: 'pending' | 'accepted' | 'rejected';
  sender?: User;
  createdAt: string;
}

export interface Friend {
  id: number;
  userId: number;
  friendId: number;
  friend: User;
  createdAt: string;
}
