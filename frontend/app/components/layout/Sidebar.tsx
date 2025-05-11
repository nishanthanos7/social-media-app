'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { getPlaceholderAvatar } from '../../lib/utils';
import { 
  FaHome, 
  FaUserFriends, 
  FaVideo, 
  FaStore, 
  FaGamepad, 
  FaCalendarAlt, 
  FaBookmark, 
  FaFlag, 
  FaUsers, 
  FaChevronDown 
} from 'react-icons/fa';

export default function Sidebar() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="hidden md:block w-1/4 pr-4">
      <div className="space-y-1 sticky top-16">
        <Link 
          href={`/profile/${user.id}`} 
          className="flex items-center p-2 rounded-lg hover:bg-gray-100"
        >
          <Image
            src={user.profilePicture || getPlaceholderAvatar(user.fullName)}
            alt={user.fullName}
            width={36}
            height={36}
            className="rounded-full mr-3"
          />
          <span className="font-medium">{user.fullName}</span>
        </Link>
        
        <Link 
          href="/" 
          className="flex items-center p-2 rounded-lg hover:bg-gray-100"
        >
          <div className="w-9 h-9 flex items-center justify-center mr-3">
            <FaHome className="text-blue-600 text-xl" />
          </div>
          <span className="font-medium">Home</span>
        </Link>
        
        <Link 
          href="/friends" 
          className="flex items-center p-2 rounded-lg hover:bg-gray-100"
        >
          <div className="w-9 h-9 flex items-center justify-center mr-3">
            <FaUserFriends className="text-blue-600 text-xl" />
          </div>
          <span className="font-medium">Friends</span>
        </Link>
        
        <Link 
          href="/watch" 
          className="flex items-center p-2 rounded-lg hover:bg-gray-100"
        >
          <div className="w-9 h-9 flex items-center justify-center mr-3">
            <FaVideo className="text-blue-600 text-xl" />
          </div>
          <span className="font-medium">Watch</span>
        </Link>
        
        <Link 
          href="/marketplace" 
          className="flex items-center p-2 rounded-lg hover:bg-gray-100"
        >
          <div className="w-9 h-9 flex items-center justify-center mr-3">
            <FaStore className="text-blue-600 text-xl" />
          </div>
          <span className="font-medium">Marketplace</span>
        </Link>
        
        <Link 
          href="/gaming" 
          className="flex items-center p-2 rounded-lg hover:bg-gray-100"
        >
          <div className="w-9 h-9 flex items-center justify-center mr-3">
            <FaGamepad className="text-blue-600 text-xl" />
          </div>
          <span className="font-medium">Gaming</span>
        </Link>
        
        <button className="flex items-center p-2 rounded-lg hover:bg-gray-100 w-full text-left">
          <div className="w-9 h-9 flex items-center justify-center mr-3 bg-gray-200 rounded-full">
            <FaChevronDown className="text-black text-sm" />
          </div>
          <span className="font-medium">See more</span>
        </button>
        
        <hr className="my-2 border-gray-300" />
        
        <h3 className="px-2 pt-2 text-gray-500 font-semibold">Your shortcuts</h3>
        
        <Link 
          href="/groups" 
          className="flex items-center p-2 rounded-lg hover:bg-gray-100"
        >
          <div className="w-9 h-9 flex items-center justify-center mr-3 bg-gray-200 rounded">
            <FaUsers className="text-gray-700" />
          </div>
          <span className="font-medium">Groups</span>
        </Link>
        
        <Link 
          href="/events" 
          className="flex items-center p-2 rounded-lg hover:bg-gray-100"
        >
          <div className="w-9 h-9 flex items-center justify-center mr-3 bg-gray-200 rounded">
            <FaCalendarAlt className="text-gray-700" />
          </div>
          <span className="font-medium">Events</span>
        </Link>
        
        <Link 
          href="/saved" 
          className="flex items-center p-2 rounded-lg hover:bg-gray-100"
        >
          <div className="w-9 h-9 flex items-center justify-center mr-3 bg-gray-200 rounded">
            <FaBookmark className="text-gray-700" />
          </div>
          <span className="font-medium">Saved</span>
        </Link>
        
        <Link 
          href="/pages" 
          className="flex items-center p-2 rounded-lg hover:bg-gray-100"
        >
          <div className="w-9 h-9 flex items-center justify-center mr-3 bg-gray-200 rounded">
            <FaFlag className="text-gray-700" />
          </div>
          <span className="font-medium">Pages</span>
        </Link>
        
        <div className="pt-2 px-3 text-xs text-gray-500">
          <p>Privacy · Terms · Advertising · Ad Choices · Cookies · More · Meta © 2023</p>
        </div>
      </div>
    </div>
  );
}
