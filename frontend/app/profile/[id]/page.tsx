'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User, Post } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { usersApi, postsApi } from '../../lib/api';
import ProfileHeader from '../../components/profile/ProfileHeader';
import PostCard from '../../components/posts/PostCard';
import CreatePostForm from '../../components/posts/CreatePostForm';
import FriendsList from '../../components/profile/FriendsList';
import { FaUserFriends, FaImage, FaInfoCircle } from 'react-icons/fa';

export default function ProfilePage() {
  const { id } = useParams();
  const userId = parseInt(id as string);
  const { user: currentUser, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userFriends, setUserFriends] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'friends' | 'photos'>('posts');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoading, isLoggedIn, router]);

  // Fetch user profile data
  useEffect(() => {
    if (isLoggedIn && userId) {
      fetchUserProfile();
    }
  }, [isLoggedIn, userId]);

  // Fetch data based on active tab
  useEffect(() => {
    if (isLoggedIn && profileUser) {
      if (activeTab === 'posts') {
        fetchUserPosts();
      } else if (activeTab === 'friends') {
        fetchUserFriends();
      }
      // For 'about' tab, we already have the data in profileUser
      // For 'photos' tab, we would fetch photos in a real app
    }
  }, [isLoggedIn, profileUser, activeTab]);

  const fetchUserProfile = async () => {
    setIsLoadingProfile(true);
    setError(null);

    try {
      const userData = await usersApi.getProfile(userId);
      setProfileUser(userData);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile. Please try again later.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const fetchUserPosts = async () => {
    setIsLoadingPosts(true);

    try {
      const posts = await postsApi.getUserPosts(userId);
      setUserPosts(posts);
    } catch (err) {
      console.error('Error fetching user posts:', err);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const fetchUserFriends = async () => {
    try {
      const friends = await usersApi.getFriends(userId);
      setUserFriends(friends);
    } catch (err) {
      console.error('Error fetching user friends:', err);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setUserPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleProfileUpdated = () => {
    fetchUserProfile();
  };

  // Show loading state
  if (isLoading || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error
  if (error || !profileUser) {
    return (
      <div className="fb-content p-4 text-center">
        <p className="text-red-600">{error || 'User not found'}</p>
      </div>
    );
  }

  // Check if this is the current user's profile
  const isCurrentUser = currentUser?.id === profileUser.id;

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <ProfileHeader
        user={profileUser}
        isCurrentUser={isCurrentUser}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* Profile Navigation */}
      <div className="fb-content">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-3 flex items-center ${
              activeTab === 'posts' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('posts')}
          >
            <span className="font-medium">Posts</span>
          </button>
          <button
            className={`px-4 py-3 flex items-center ${
              activeTab === 'about' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('about')}
          >
            <FaInfoCircle className="mr-2" />
            <span className="font-medium">About</span>
          </button>
          <button
            className={`px-4 py-3 flex items-center ${
              activeTab === 'friends' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('friends')}
          >
            <FaUserFriends className="mr-2" />
            <span className="font-medium">Friends</span>
          </button>
          <button
            className={`px-4 py-3 flex items-center ${
              activeTab === 'photos' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('photos')}
          >
            <FaImage className="mr-2" />
            <span className="font-medium">Photos</span>
          </button>
        </div>
      </div>

      {/* Create Post Form (only for current user) */}
      {isLoggedIn && isCurrentUser && activeTab === 'posts' && (
        <CreatePostForm onPostCreated={handlePostCreated} />
      )}

      {/* Tab Content */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {isLoadingPosts ? (
            <div className="fb-content p-4 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-500">Loading posts...</p>
            </div>
          ) : userPosts.length > 0 ? (
            userPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="fb-content p-4 text-center">
              <p className="text-sm text-gray-500">No posts to display</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'about' && (
        <div className="fb-content p-4">
          <h2 className="text-xl font-bold mb-4">About</h2>

          <div className="space-y-4">
            {profileUser.bio && (
              <div>
                <h3 className="font-semibold mb-2">Bio</h3>
                <p>{profileUser.bio}</p>
              </div>
            )}

            {profileUser.location && (
              <div>
                <h3 className="font-semibold mb-2">Location</h3>
                <p>{profileUser.location}</p>
              </div>
            )}

            {profileUser.work && profileUser.work.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Work</h3>
                <ul className="space-y-2">
                  {profileUser.work.map((work, index) => (
                    <li key={index}>
                      <p className="font-medium">{work.position} at {work.company}</p>
                      <p className="text-sm text-gray-500">{work.year}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {profileUser.education && profileUser.education.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Education</h3>
                <ul className="space-y-2">
                  {profileUser.education.map((edu, index) => (
                    <li key={index}>
                      <p className="font-medium">{edu.degree} at {edu.school}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!profileUser.bio && !profileUser.location &&
             (!profileUser.work || profileUser.work.length === 0) &&
             (!profileUser.education || profileUser.education.length === 0) && (
              <p className="text-gray-500 italic">No information to display</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'friends' && (
        <FriendsList
          friends={userFriends}
          title={`Friends · ${userFriends.length}`}
          emptyMessage={`${isCurrentUser ? 'You don\'t' : 'This user doesn\'t'} have any friends yet.`}
        />
      )}

      {activeTab === 'photos' && (
        <div className="fb-content p-4">
          <h2 className="text-xl font-bold mb-4">Photos</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {/* Sample photos - in a real app, these would come from the API */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aspect-square relative overflow-hidden rounded">
                <img
                  src={`https://picsum.photos/id/${200 + index}/300/300`}
                  alt={`Photo ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
