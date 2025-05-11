'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '../../types';
import { getPlaceholderAvatar } from '../../lib/utils';
import { usersApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function FriendRequests() {
  const { user } = useAuth();
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (!user) return;
      
      try {
        const requests = await usersApi.getFriendRequests();
        setFriendRequests(requests);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriendRequests();
  }, [user]);

  const handleAcceptRequest = async (userId: number) => {
    if (!user) return;
    
    setActionInProgress(userId);
    try {
      await usersApi.acceptFriendRequest(userId);
      // Remove from the list
      setFriendRequests(prev => prev.filter(request => request.id !== userId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRejectRequest = async (userId: number) => {
    if (!user) return;
    
    setActionInProgress(userId);
    try {
      await usersApi.rejectFriendRequest(userId);
      // Remove from the list
      setFriendRequests(prev => prev.filter(request => request.id !== userId));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    } finally {
      setActionInProgress(null);
    }
  };

  if (isLoading) {
    return (
      <div className="fb-content mb-4">
        <div className="p-2 border-b border-gray-200">
          <h3 className="text-sm font-bold">Friend Requests</h3>
        </div>
        <div className="p-4 text-center">
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-1 text-xs text-gray-500">Loading friend requests...</p>
        </div>
      </div>
    );
  }

  if (friendRequests.length === 0) {
    return (
      <div className="fb-content mb-4">
        <div className="p-2 border-b border-gray-200">
          <h3 className="text-sm font-bold">Friend Requests</h3>
        </div>
        <div className="p-4 text-center">
          <p className="text-xs text-gray-500">No friend requests at this time</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fb-content mb-4">
      <div className="p-2 border-b border-gray-200">
        <h3 className="text-sm font-bold">Friend Requests</h3>
      </div>
      
      <div className="p-2">
        <div className="space-y-3">
          {friendRequests.map(request => (
            <div key={request.id} className="flex items-center">
              <Link href={`/profile/${request.id}`} className="shrink-0">
                <Image
                  src={request.profilePicture || getPlaceholderAvatar(request.fullName)}
                  alt={request.fullName}
                  width={40}
                  height={40}
                  className="rounded-full mr-2"
                />
              </Link>
              
              <div className="flex-grow">
                <Link href={`/profile/${request.id}`} className="font-bold text-xs hover:underline">
                  {request.fullName}
                </Link>
                {request.location && (
                  <p className="text-xs text-gray-500">From {request.location}</p>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAcceptRequest(request.id)}
                  disabled={actionInProgress === request.id}
                  className="fb-button text-xs"
                >
                  {actionInProgress === request.id ? '...' : 'Accept'}
                </button>
                
                <button
                  onClick={() => handleRejectRequest(request.id)}
                  disabled={actionInProgress === request.id}
                  className="fb-button-secondary text-xs"
                >
                  {actionInProgress === request.id ? '...' : 'Decline'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
