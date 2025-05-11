import { getToken, removeToken } from './auth';

// Base URL for API requests
const BASE_URL = '/api/v1';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Handle 401 Unauthorized errors
    if (response.status === 401) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    // Parse error response
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  return response.json();
};

// Helper function for making API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();

  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Make the request
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
};

// API functions for authentication
export const authApi = {
  login: async (username: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  register: async (username: string, password: string, fullName?: string) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, fullName }),
    });
  },
};

// API functions for users
export const usersApi = {
  getProfile: async (userId: number) => {
    return apiRequest(`/users/${userId}/profile`);
  },
  updateProfile: async (
    userId: number,
    updates: {
      fullName?: string;
      bio?: string;
      location?: string;
      education?: { school: string; degree: string; year: string }[];
      work?: { company: string; position: string; year: string }[];
    }
  ) => {
    return apiRequest(`/users/${userId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  uploadProfilePicture: async (userId: number, imageData: FormData) => {
    return apiRequest(`/users/${userId}/profile-picture`, {
      method: 'POST',
      body: imageData,
      headers: {}, // Let the browser set the content type with boundary
    });
  },
  uploadCoverPhoto: async (userId: number, imageData: FormData) => {
    return apiRequest(`/users/${userId}/cover-photo`, {
      method: 'POST',
      body: imageData,
      headers: {}, // Let the browser set the content type with boundary
    });
  },
  getFriends: async (userId: number) => {
    return apiRequest(`/users/${userId}/friends`);
  },
  getFriendRequests: async () => {
    return apiRequest('/users/friend-requests');
  },
  sendFriendRequest: async (userId: number) => {
    return apiRequest(`/users/${userId}/friend-request`, {
      method: 'POST',
    });
  },
  acceptFriendRequest: async (userId: number) => {
    return apiRequest(`/users/${userId}/accept-friend`, {
      method: 'POST',
    });
  },
  rejectFriendRequest: async (userId: number) => {
    return apiRequest(`/users/${userId}/reject-friend`, {
      method: 'POST',
    });
  },
  removeFriend: async (userId: number) => {
    return apiRequest(`/users/${userId}/remove-friend`, {
      method: 'POST',
    });
  },
  getNotifications: async () => {
    return apiRequest('/users/notifications');
  },
  markNotificationAsRead: async (notificationId: number) => {
    return apiRequest(`/users/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  },
  markAllNotificationsAsRead: async () => {
    return apiRequest('/users/notifications/read-all', {
      method: 'POST',
    });
  },
  getSuggestedFriends: async () => {
    return apiRequest('/users/suggested-friends');
  },
  searchUsers: async (query: string) => {
    return apiRequest(`/users/search?q=${encodeURIComponent(query)}`);
  },
};

// API functions for posts
export const postsApi = {
  getFeed: async () => {
    return apiRequest('/posts/feed');
  },
  getTrendingPosts: async () => {
    return apiRequest('/posts/trending');
  },
  getSuggestedPosts: async () => {
    return apiRequest('/posts/suggested');
  },
  getUserPosts: async (userId: number) => {
    return apiRequest(`/posts/user/${userId}`);
  },
  getPost: async (postId: number) => {
    return apiRequest(`/posts/${postId}`);
  },
  createPost: async (
    content: string,
    postType: 'text' | 'image' | 'video' | 'link' = 'text',
    imageUrl?: string,
    videoUrl?: string,
    linkData?: { url: string, title: string, description: string, image: string },
    location?: string,
    taggedUsers?: number[],
    privacy: 'public' | 'friends' | 'private' = 'public'
  ) => {
    return apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify({
        content,
        postType,
        imageUrl,
        videoUrl,
        linkData,
        location,
        taggedUsers,
        privacy
      }),
    });
  },
  // Legacy methods for backward compatibility
  likePost: async (postId: number) => {
    return apiRequest(`/posts/${postId}/like`, {
      method: 'POST',
    });
  },
  unlikePost: async (postId: number) => {
    return apiRequest(`/posts/${postId}/unlike`, {
      method: 'POST',
    });
  },
  // New reaction methods
  addReaction: async (postId: number, reactionType: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry') => {
    return apiRequest(`/posts/${postId}/reaction`, {
      method: 'POST',
      body: JSON.stringify({ reactionType }),
    });
  },
  removeReaction: async (postId: number, reactionType: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry') => {
    return apiRequest(`/posts/${postId}/reaction/${reactionType}`, {
      method: 'DELETE',
    });
  },
  sharePost: async (postId: number, content: string) => {
    return apiRequest(`/posts/${postId}/share`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
  getComments: async (postId: number) => {
    return apiRequest(`/posts/${postId}/comments`);
  },
  addComment: async (postId: number, content: string, parentId?: number, taggedUsers?: number[]) => {
    return apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentId, taggedUsers }),
    });
  },
  addCommentReaction: async (commentId: number, reactionType: 'like' | 'love') => {
    return apiRequest(`/comments/${commentId}/reaction`, {
      method: 'POST',
      body: JSON.stringify({ reactionType }),
    });
  },
  removeCommentReaction: async (commentId: number, reactionType: 'like' | 'love') => {
    return apiRequest(`/comments/${commentId}/reaction/${reactionType}`, {
      method: 'DELETE',
    });
  },
};
