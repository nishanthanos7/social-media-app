'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import NotificationsList from '../components/notifications/NotificationsList';

export default function NotificationsPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoading, isLoggedIn, router]);

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
      <div className="fb-content p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>
      
      <NotificationsList />
    </div>
  );
}
