'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, FriendRequest } from '../../types';
import { getPlaceholderAvatar } from '../../lib/utils';
import { usersApi } from '../../lib/api';

interface FriendsListProps {
  friends: User[];
  friendRequests?: FriendRequest[];
  onAcceptFriend?: (userId: number) => void;
}

export default function FriendsList({ friends, friendRequests = [], onAcceptFriend }: FriendsListProps) {
  const [acceptingIds, setAcceptingIds] = React.useState<number[]>([]);

  const handleAcceptFriend = async (userId: number) => {
    setAcceptingIds(prev => [...prev, userId]);
    try {
      await usersApi.acceptFriendRequest(userId);
      if (onAcceptFriend) {
        onAcceptFriend(userId);
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    } finally {
      setAcceptingIds(prev => prev.filter(id => id !== userId));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Friends</h2>
      </div>
      
      {/* Friend Requests Section */}
      {friendRequests.length > 0 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Friend Requests</h3>
          <div className="space-y-4">
            {friendRequests.map((request) => (
              <div key={request.fromUserId} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Link href={`/profile/${request.fromUserId}`}>
                    <Image 
                      src={request.fromUser?.profilePicture || getPlaceholderAvatar(request.fromUser?.fullName || 'User')} 
                      alt={request.fromUser?.fullName || 'User'} 
                      width={40} 
                      height={40} 
                      className="rounded-full"
                    />
                  </Link>
                  <div className="ml-3">
                    <Link href={`/profile/${request.fromUserId}`} className="font-medium text-gray-900 dark:text-white hover:underline">
                      {request.fromUser?.fullName || request.fromUser?.username || 'User'}
                    </Link>
                  </div>
                </div>
                <button 
                  onClick={() => handleAcceptFriend(request.fromUserId)}
                  disabled={acceptingIds.includes(request.fromUserId)}
                  className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {acceptingIds.includes(request.fromUserId) ? 'Accepting...' : 'Accept'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Friends List */}
      <div className="p-4">
        {friends.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {friends.map((friend) => (
              <Link 
                key={friend.id} 
                href={`/profile/${friend.id}`}
                className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Image 
                  src={friend.profilePicture || getPlaceholderAvatar(friend.fullName || friend.username)} 
                  alt={friend.fullName || friend.username} 
                  width={48} 
                  height={48} 
                  className="rounded-full"
                />
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {friend.fullName || friend.username}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{friend.username}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No friends yet. Start connecting with people!
          </p>
        )}
      </div>
    </div>
  );
}
