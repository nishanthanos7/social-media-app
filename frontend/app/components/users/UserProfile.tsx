'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { User } from '../../types';
import { formatDate, getPlaceholderAvatar } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../lib/api';

interface UserProfileProps {
  profileUser: User;
  onFriendStatusChange?: () => void;
}

export default function UserProfile({ profileUser, onFriendStatusChange }: UserProfileProps) {
  const { user } = useAuth();
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  
  const isCurrentUser = user?.id === profileUser.id;
  const isFriend = user?.friends?.includes(profileUser.id);
  const hasSentRequest = profileUser.friendRequests?.includes(user?.id);
  const hasReceivedRequest = user?.friendRequests?.includes(profileUser.id);

  const handleSendFriendRequest = async () => {
    if (!user) return;
    
    setIsSendingRequest(true);
    try {
      await usersApi.sendFriendRequest(profileUser.id);
      if (onFriendStatusChange) onFriendStatusChange();
    } catch (error) {
      console.error('Error sending friend request:', error);
    } finally {
      setIsSendingRequest(false);
    }
  };

  const handleAcceptFriendRequest = async () => {
    if (!user) return;
    
    setIsAccepting(true);
    try {
      await usersApi.acceptFriendRequest(profileUser.id);
      if (onFriendStatusChange) onFriendStatusChange();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Cover Photo */}
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      
      {/* Profile Info */}
      <div className="relative px-4 sm:px-6 pb-6">
        {/* Profile Picture */}
        <div className="absolute -top-16 left-4 sm:left-6">
          <Image 
            src={profileUser.profilePicture || getPlaceholderAvatar(profileUser.fullName || profileUser.username)} 
            alt={profileUser.fullName || profileUser.username} 
            width={96} 
            height={96} 
            className="rounded-full border-4 border-white dark:border-gray-800"
          />
        </div>
        
        {/* Friend Action Button */}
        {!isCurrentUser && (
          <div className="flex justify-end mt-4">
            {isFriend ? (
              <button 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                disabled
              >
                Friends
              </button>
            ) : hasReceivedRequest ? (
              <button 
                onClick={handleAcceptFriendRequest}
                disabled={isAccepting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAccepting ? 'Accepting...' : 'Accept Friend Request'}
              </button>
            ) : hasSentRequest ? (
              <button 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                disabled
              >
                Friend Request Sent
              </button>
            ) : (
              <button 
                onClick={handleSendFriendRequest}
                disabled={isSendingRequest}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingRequest ? 'Sending...' : 'Add Friend'}
              </button>
            )}
          </div>
        )}
        
        {/* User Info */}
        <div className="mt-16 sm:mt-20">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {profileUser.fullName || profileUser.username}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">@{profileUser.username}</p>
          
          {profileUser.bio && (
            <p className="mt-4 text-gray-700 dark:text-gray-300">{profileUser.bio}</p>
          )}
          
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>Member since {formatDate(profileUser.createdAt || '')}</p>
            <p className="mt-1">{profileUser.friends?.length || 0} friends</p>
          </div>
        </div>
      </div>
    </div>
  );
}
