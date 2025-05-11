'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { getPlaceholderAvatar } from '../../lib/utils';
import { usersApi } from '../../lib/api';
import { FaSearch, FaVideo, FaEllipsisH, FaCircle } from 'react-icons/fa';

export default function RightSidebar() {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return;
      
      try {
        const response = await usersApi.getFriends(user.id);
        setFriends(response);
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFriends();
  }, [user]);
  
  if (!user) return null;
  
  // Generate some random online statuses for friends
  const getRandomOnlineStatus = (userId: number) => {
    // Use the user ID as a seed for consistent randomness
    return userId % 3 === 0; // Roughly 1/3 of friends will be "online"
  };
  
  return (
    <div className="hidden lg:block w-1/4 pl-4">
      <div className="sticky top-16 space-y-4">
        {/* Sponsored */}
        <div className="fb-sidebar p-4">
          <h3 className="font-semibold mb-2">Sponsored</h3>
          <div className="space-y-4">
            <div>
              <div className="relative w-full h-32 rounded overflow-hidden mb-2">
                <Image
                  src="https://picsum.photos/id/26/300/200"
                  alt="Advertisement"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div>
                <p className="text-xs font-medium">Brand New Gadgets</p>
                <p className="text-xs text-gray-500">example.com</p>
              </div>
            </div>
            <div>
              <div className="relative w-full h-32 rounded overflow-hidden mb-2">
                <Image
                  src="https://picsum.photos/id/96/300/200"
                  alt="Advertisement"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div>
                <p className="text-xs font-medium">Travel Destinations</p>
                <p className="text-xs text-gray-500">travel-example.com</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Birthdays */}
        <div className="fb-sidebar p-4">
          <h3 className="font-semibold mb-2">Birthdays</h3>
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center mr-2">
              <span className="text-2xl">🎂</span>
            </div>
            <p className="text-xs">
              <Link href="/profile/3" className="font-semibold hover:underline">Mike Smith</Link>
              {' '}and{' '}
              <Link href="/profile/8" className="font-semibold hover:underline">Olivia Martinez</Link>
              {' '}have birthdays today.
            </p>
          </div>
        </div>
        
        {/* Contacts */}
        <div className="fb-sidebar p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Contacts</h3>
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:bg-gray-200 p-1 rounded-full">
                <FaVideo size={16} />
              </button>
              <button className="text-gray-500 hover:bg-gray-200 p-1 rounded-full">
                <FaSearch size={16} />
              </button>
              <button className="text-gray-500 hover:bg-gray-200 p-1 rounded-full">
                <FaEllipsisH size={16} />
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-5 w-5 border-2 border-blue-600 rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-1">
              {friends.map((friend: any) => (
                <Link 
                  key={friend.id}
                  href={`/profile/${friend.id}`}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="relative">
                    <Image
                      src={friend.profilePicture || getPlaceholderAvatar(friend.fullName)}
                      alt={friend.fullName}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    {getRandomOnlineStatus(friend.id) && (
                      <div className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <span className="ml-3 font-medium">{friend.fullName}</span>
                </Link>
              ))}
              
              {friends.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-2">No contacts to display</p>
              )}
            </div>
          )}
        </div>
        
        {/* Group Conversations */}
        <div className="fb-sidebar p-4">
          <h3 className="font-semibold mb-2">Group Conversations</h3>
          <button className="flex items-center p-2 rounded-lg hover:bg-gray-100 w-full text-left">
            <div className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full mr-3">
              <span className="text-xl">➕</span>
            </div>
            <span className="font-medium">Create New Group</span>
          </button>
        </div>
      </div>
    </div>
  );
}
