'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '../../types';
import { getPlaceholderAvatar } from '../../lib/utils';
import { FaUserPlus, FaUserCheck, FaUserClock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../lib/api';

interface FriendsListProps {
  friends: User[];
  title?: string;
  emptyMessage?: string;
  showAddButton?: boolean;
}

export default function FriendsList({ 
  friends, 
  title = "Friends", 
  emptyMessage = "No friends to display", 
  showAddButton = false 
}: FriendsListProps) {
  const { user: currentUser } = useAuth();
  
  const handleSendFriendRequest = async (userId: number) => {
    if (!currentUser) return;
    
    try {
      await usersApi.sendFriendRequest(userId);
      // In a real app, you would update the UI to reflect the new status
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };
  
  return (
    <div className="fb-content mb-4">
      <div className="p-2 border-b border-gray-200">
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      
      {friends.length > 0 ? (
        <div className="p-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {friends.map(friend => (
              <div key={friend.id} className="border border-gray-200 rounded p-2 text-center">
                <Link href={`/profile/${friend.id}`}>
                  <div className="relative w-full h-24 mb-2">
                    <Image
                      src={friend.profilePicture || getPlaceholderAvatar(friend.fullName)}
                      alt={friend.fullName}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded"
                    />
                  </div>
                  <h4 className="text-xs font-bold truncate">{friend.fullName}</h4>
                </Link>
                
                {showAddButton && currentUser && friend.id !== currentUser.id && (
                  <div className="mt-2">
                    {/* In a real app, you would check if already friends or if request is pending */}
                    <button
                      onClick={() => handleSendFriendRequest(friend.id)}
                      className="fb-button text-xs flex items-center justify-center w-full"
                    >
                      <FaUserPlus className="mr-1" size={10} />
                      Add Friend
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center">
          <p className="text-xs text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
