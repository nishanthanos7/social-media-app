'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { getPlaceholderAvatar } from '../../lib/utils';
import { FaHome, FaUserFriends, FaFacebookMessenger, FaBell, FaCaretDown, FaSearch } from 'react-icons/fa';
import { usersApi } from '../../lib/api';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close menus when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Fetch notifications count
    const fetchNotificationsCount = async () => {
      if (!isLoggedIn) return;

      try {
        const notifications = await usersApi.getNotifications();
        const unreadCount = notifications.filter((n: any) => !n.read).length;
        setUnreadNotificationsCount(unreadCount);
        setNotifications(notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotificationsCount();
    // In a real app, you would set up a polling mechanism or websocket
    // to update notifications in real-time
  }, [isLoggedIn]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <nav className="fb-header h-12 shadow-md">
      <div className="container mx-auto max-w-6xl flex items-center justify-between h-full px-2">
        {/* Left section: Logo and Search */}
        <div className="flex items-center h-full">
          <Link href="/" className="text-blue-600 font-bold text-2xl mr-4">
            facebook
          </Link>

          {isLoggedIn && (
            <div className="hidden md:flex items-center h-full">
              <div className="relative h-full flex items-center">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search Facebook"
                    className="fb-input h-8 w-40 md:w-60 text-xs rounded-full pl-8"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Middle section: Navigation Icons */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center justify-center flex-1 h-full">
            <Link
              href="/"
              className="h-full flex items-center px-4 border-b-2 border-blue-600 text-blue-600"
            >
              <FaHome size={20} />
            </Link>
            <Link
              href="/friends"
              className="h-full flex items-center px-4 border-b-2 border-transparent hover:border-blue-600 hover:text-blue-600 text-gray-500"
            >
              <FaUserFriends size={20} />
            </Link>
            <Link
              href="/messages"
              className="h-full flex items-center px-4 border-b-2 border-transparent hover:border-blue-600 hover:text-blue-600 text-gray-500"
            >
              <FaFacebookMessenger size={20} />
            </Link>
          </div>
        )}

        {/* Right section: User Menu */}
        <div className="flex items-center h-full">
          {isLoggedIn ? (
            <div className="flex items-center">
              {/* Mobile Navigation */}
              <div className="flex md:hidden items-center mr-2 text-gray-700">
                <Link href="/" className="mx-1 p-2 hover:bg-gray-200 rounded-full">
                  <FaHome size={20} className="text-blue-600" />
                </Link>
                <Link href="/friends" className="mx-1 p-2 hover:bg-gray-200 rounded-full">
                  <FaUserFriends size={20} />
                </Link>
              </div>

              {/* Notifications */}
              <div className="relative mr-2" ref={notificationsRef}>
                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={toggleNotifications}
                >
                  <FaBell size={18} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-80 bg-white border border-gray-300 shadow-md rounded-md max-h-96 overflow-y-auto">
                    <div className="p-2 border-b border-gray-200">
                      <h3 className="text-sm font-bold">Notifications</h3>
                    </div>
                    <div className="py-1">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notification: any) => (
                          <div
                            key={notification.id}
                            className={`p-2 hover:bg-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex items-center">
                              <Image
                                src={notification.fromUser?.profilePicture || getPlaceholderAvatar('User')}
                                alt="User"
                                width={40}
                                height={40}
                                className="rounded-full mr-2"
                              />
                              <div>
                                <p className="text-xs">
                                  <span className="font-bold">{notification.fromUser?.fullName || 'Someone'}</span>
                                  {notification.type === 'FRIEND_REQUEST' && ' sent you a friend request'}
                                  {notification.type === 'POST_LIKE' && ' liked your post'}
                                  {notification.type === 'COMMENT' && ' commented on your post'}
                                  {notification.type === 'SHARE' && ' shared your post'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-4 text-xs text-gray-500">No notifications</p>
                      )}
                      <div className="p-2 border-t border-gray-200 text-center">
                        <Link
                          href="/notifications"
                          className="text-blue-500 text-xs hover:underline"
                          onClick={() => setIsNotificationsOpen(false)}
                        >
                          See all notifications
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  className="flex items-center text-gray-700 text-xs hover:bg-gray-200 rounded-full p-1"
                  onClick={toggleMenu}
                >
                  <Image
                    className="w-10 h-10 rounded-full border border-gray-200"
                    src={user?.profilePicture || getPlaceholderAvatar(user?.fullName || user?.username || '')}
                    alt="user photo"
                    width={40}
                    height={40}
                  />
                  <FaCaretDown className="ml-1 text-gray-600" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-64 bg-white border border-gray-300 shadow-md rounded-md">
                    <div className="p-2 border-b border-gray-200">
                      <Link
                        href={`/profile/${user?.id}`}
                        className="flex items-center hover:bg-gray-100 p-2 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Image
                          className="w-10 h-10 rounded-full mr-2"
                          src={user?.profilePicture || getPlaceholderAvatar(user?.fullName || user?.username || '')}
                          alt="user photo"
                          width={40}
                          height={40}
                        />
                        <div>
                          <p className="font-bold text-sm">{user?.fullName || user?.username}</p>
                          <p className="text-xs text-gray-500">View your profile</p>
                        </div>
                      </Link>
                    </div>
                    <ul className="py-1 text-sm">
                      <li>
                        <Link
                          href="/"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/friends"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Friends
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/notifications"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Notifications
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <Link
                href="/auth/login"
                className="fb-button mr-2 text-xs"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="fb-button text-xs"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
