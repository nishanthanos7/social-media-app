'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from './types';
import { useAuth } from './context/AuthContext';
import { postsApi } from './lib/api';
import PostCard from './components/posts/PostCard';
import CreatePostForm from './components/posts/CreatePostForm';
import { FaRss, FaFire } from 'react-icons/fa';

export default function Home() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'trending'>('feed');
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts for the feed
  useEffect(() => {
    if (isLoggedIn && user) {
      if (activeTab === 'feed') {
        fetchFeed();
      } else {
        fetchTrending();
      }
    }
  }, [isLoggedIn, user, activeTab]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoading, isLoggedIn, router]);

  const fetchFeed = async () => {
    setIsLoadingPosts(true);
    setError(null);

    try {
      const fetchedPosts = await postsApi.getFeed();
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const fetchTrending = async () => {
    setIsLoadingPosts(true);
    setError(null);

    try {
      const fetchedPosts = await postsApi.getTrendingPosts();
      setTrendingPosts(fetchedPosts);
    } catch (err) {
      console.error('Error fetching trending posts:', err);
      setError('Failed to load trending posts. Please try again later.');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Get the active posts based on the selected tab
  const activePosts = activeTab === 'feed' ? posts : trendingPosts;

  // If authenticated, show the feed
  return (
    <>
      {/* Stories Section */}
      <div className="fb-content mb-4 p-4">
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {/* Create Story Card */}
          <div className="flex-shrink-0 w-32 h-48 rounded-lg overflow-hidden relative bg-white shadow-sm border border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-30"></div>
            <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-1">
                <span className="text-xl">+</span>
              </div>
              <p className="text-xs font-medium">Create Story</p>
            </div>
          </div>

          {/* Sample Stories */}
          {[1, 2, 3, 4, 5].map((id) => (
            <div key={id} className="flex-shrink-0 w-32 h-48 rounded-lg overflow-hidden relative shadow-sm">
              <img
                src={`https://picsum.photos/id/${id + 100}/300/500`}
                alt="Story"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              <div className="absolute top-2 left-2 w-10 h-10 rounded-full border-4 border-blue-600 overflow-hidden">
                <img
                  src={`https://randomuser.me/api/portraits/${id % 2 === 0 ? 'women' : 'men'}/${id}.jpg`}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-medium">User Story {id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Post */}
      <CreatePostForm onPostCreated={handlePostCreated} />

      {/* Feed Tabs */}
      <div className="fb-content mb-4">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 flex items-center justify-center ${
              activeTab === 'feed' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('feed')}
          >
            <FaRss className="mr-2" />
            <span className="font-medium">Feed</span>
          </button>
          <button
            className={`flex-1 py-3 flex items-center justify-center ${
              activeTab === 'trending' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('trending')}
          >
            <FaFire className="mr-2" />
            <span className="font-medium">Trending</span>
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      {isLoadingPosts ? (
        <div className="fb-content p-4 text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Loading posts...</p>
        </div>
      ) : error ? (
        <div className="fb-content p-4 text-sm text-red-600" role="alert">
          {error}
        </div>
      ) : activePosts.length > 0 ? (
        <div className="space-y-4">
          {activePosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="fb-content p-4 text-center">
          <p className="text-sm text-gray-500">
            {activeTab === 'feed'
              ? 'No posts yet. Create a post or add some friends to see their posts!'
              : 'No trending posts available right now.'}
          </p>
        </div>
      )}
    </>
  );
}
