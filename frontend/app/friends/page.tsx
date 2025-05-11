'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../lib/api';
import FriendsList from '../components/profile/FriendsList';
import FriendRequests from '../components/profile/FriendRequests';
import { FaUserFriends, FaUserPlus, FaUserClock } from 'react-icons/fa';

export default function FriendsPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [friends, setFriends] = useState<User[]>([]);
  const [suggestedFriends, setSuggestedFriends] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'requests' | 'suggestions'>('all');
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoading, isLoggedIn, router]);

  // Fetch friends data
  useEffect(() => {
    if (isLoggedIn && user) {
      fetchFriends();
      fetchSuggestedFriends();
    }
  }, [isLoggedIn, user]);

  const fetchFriends = async () => {
    if (!user) return;

    setIsLoadingFriends(true);
    setError(null);

    try {
      const userFriends = await usersApi.getFriends(user.id);
      setFriends(userFriends);
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError('Failed to load friends. Please try again later.');
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const fetchSuggestedFriends = async () => {
    if (!user) return;

    try {
      const suggested = await usersApi.getSuggestedFriends();
      setSuggestedFriends(suggested);
    } catch (err) {
      console.error('Error fetching suggested friends:', err);
    }
  };

  // Show loading state
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

  return (
    <div className="space-y-4">
      <div className="fb-content">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Friends</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 flex items-center justify-center ${
              activeTab === 'all' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('all')}
          >
            <FaUserFriends className="mr-2" />
            <span className="font-medium">All Friends</span>
          </button>
          <button
            className={`flex-1 py-3 flex items-center justify-center ${
              activeTab === 'requests' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('requests')}
          >
            <FaUserClock className="mr-2" />
            <span className="font-medium">Friend Requests</span>
          </button>
          <button
            className={`flex-1 py-3 flex items-center justify-center ${
              activeTab === 'suggestions' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('suggestions')}
          >
            <FaUserPlus className="mr-2" />
            <span className="font-medium">Suggestions</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'all' && (
        <>
          {isLoadingFriends ? (
            <div className="fb-content p-4 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-500">Loading friends...</p>
            </div>
          ) : error ? (
            <div className="fb-content p-4 text-sm text-red-600" role="alert">
              {error}
            </div>
          ) : (
            <FriendsList
              friends={friends}
              title={`Friends · ${friends.length}`}
              emptyMessage="You don't have any friends yet. Check out the suggestions tab to find people you may know."
            />
          )}
        </>
      )}

      {activeTab === 'requests' && (
        <FriendRequests />
      )}

      {activeTab === 'suggestions' && (
        <>
          <FriendsList
            friends={suggestedFriends}
            title="People You May Know"
            emptyMessage="No suggestions available at this time."
            showAddButton={true}
          />

          {/* Sample Suggestions Section */}
          <div className="fb-content p-4">
            <h2 className="text-lg font-bold mb-4">Find Friends</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Search for Friends</h3>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Search by name or email"
                    className="fb-input flex-grow"
                  />
                  <button className="fb-button ml-2">Search</button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Invite Friends</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Invite your friends to join and connect with you on our platform.
                </p>
                <button className="fb-button">Invite Friends</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
