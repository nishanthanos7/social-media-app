'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Notification } from '../../types';
import { getPlaceholderAvatar, formatRelativeTime } from '../../lib/utils';
import { usersApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { FaUserPlus, FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';

export default function NotificationsList() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        const fetchedNotifications = await usersApi.getNotifications();
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (notificationId: number) => {
    if (!user) return;
    
    try {
      await usersApi.markNotificationAsRead(notificationId);
      // Update the local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      await usersApi.markAllNotificationsAsRead();
      // Update the local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Helper function to render the notification icon
  const renderNotificationIcon = (type: string) => {
    switch (type) {
      case 'FRIEND_REQUEST':
        return <FaUserPlus className="text-blue-500" />;
      case 'POST_LIKE':
        return <FaThumbsUp className="text-blue-500" />;
      case 'COMMENT':
        return <FaComment className="text-blue-500" />;
      case 'SHARE':
        return <FaShare className="text-blue-500" />;
      default:
        return null;
    }
  };

  // Helper function to render the notification text
  const renderNotificationText = (notification: Notification) => {
    const fromUser = notification.fromUser?.fullName || 'Someone';
    
    switch (notification.type) {
      case 'FRIEND_REQUEST':
        return (
          <span>
            <Link href={`/profile/${notification.fromUserId}`} className="font-bold hover:underline">
              {fromUser}
            </Link>{' '}
            sent you a friend request.
          </span>
        );
      case 'POST_LIKE':
        return (
          <span>
            <Link href={`/profile/${notification.fromUserId}`} className="font-bold hover:underline">
              {fromUser}
            </Link>{' '}
            liked your post.
          </span>
        );
      case 'COMMENT':
        return (
          <span>
            <Link href={`/profile/${notification.fromUserId}`} className="font-bold hover:underline">
              {fromUser}
            </Link>{' '}
            commented on your post.
          </span>
        );
      case 'SHARE':
        return (
          <span>
            <Link href={`/profile/${notification.fromUserId}`} className="font-bold hover:underline">
              {fromUser}
            </Link>{' '}
            shared your post.
          </span>
        );
      default:
        return <span>You have a new notification.</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="fb-content mb-4">
        <div className="p-2 border-b border-gray-200">
          <h3 className="text-sm font-bold">Notifications</h3>
        </div>
        <div className="p-4 text-center">
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-1 text-xs text-gray-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="fb-content mb-4">
        <div className="p-2 border-b border-gray-200">
          <h3 className="text-sm font-bold">Notifications</h3>
        </div>
        <div className="p-4 text-center">
          <p className="text-xs text-gray-500">No notifications at this time</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fb-content mb-4">
      <div className="p-2 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-bold">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </h3>
        
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs text-blue-500 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="divide-y divide-gray-100">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`p-2 flex items-center ${!notification.read ? 'bg-blue-50' : ''}`}
            onClick={() => !notification.read && handleMarkAsRead(notification.id)}
          >
            <div className="mr-3 text-lg">
              {renderNotificationIcon(notification.type)}
            </div>
            
            <div className="mr-3">
              <Image
                src={notification.fromUser?.profilePicture || getPlaceholderAvatar(notification.fromUser?.fullName || 'User')}
                alt={notification.fromUser?.fullName || 'User'}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            
            <div className="flex-grow">
              <p className="text-xs">
                {renderNotificationText(notification)}
              </p>
              <p className="text-xs text-gray-500">
                {formatRelativeTime(notification.createdAt)}
              </p>
            </div>
            
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
