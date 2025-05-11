'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '../../types';
import { getPlaceholderAvatar } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../lib/api';
import { FaUserPlus, FaUserCheck, FaUserClock, FaEdit, FaCamera } from 'react-icons/fa';

interface ProfileHeaderProps {
  user: User;
  isCurrentUser: boolean;
  onProfileUpdated: () => void;
}

export default function ProfileHeader({ user, isCurrentUser, onProfileUpdated }: ProfileHeaderProps) {
  const { user: currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [friendRequestStatus, setFriendRequestStatus] = useState<'none' | 'pending' | 'friends'>(
    user.friends?.includes(currentUser?.id) ? 'friends' :
    user.friendRequests?.includes(currentUser?.id) ? 'pending' : 'none'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit profile form state
  const [bio, setBio] = useState(user.bio || '');
  const [location, setLocation] = useState(user.location || '');
  
  const handleSendFriendRequest = async () => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    try {
      await usersApi.sendFriendRequest(user.id);
      setFriendRequestStatus('pending');
    } catch (error) {
      console.error('Error sending friend request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAcceptFriendRequest = async () => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    try {
      await usersApi.acceptFriendRequest(user.id);
      setFriendRequestStatus('friends');
    } catch (error) {
      console.error('Error accepting friend request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    try {
      await usersApi.updateProfile(user.id, {
        bio,
        location
      });
      setIsEditing(false);
      onProfileUpdated();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUploadProfilePicture = () => {
    // In a real app, this would open a file picker and upload the image
    alert('In a real app, this would allow you to upload a profile picture');
  };
  
  const handleUploadCoverPhoto = () => {
    // In a real app, this would open a file picker and upload the image
    alert('In a real app, this would allow you to upload a cover photo');
  };
  
  return (
    <div className="fb-content mb-4">
      {/* Cover Photo */}
      <div className="relative w-full h-48 bg-gray-200">
        {user.coverPhoto ? (
          <Image
            src={user.coverPhoto}
            alt={`${user.fullName}'s cover photo`}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-100 to-blue-200" />
        )}
        
        {isCurrentUser && (
          <button
            onClick={handleUploadCoverPhoto}
            className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md"
          >
            <FaCamera />
          </button>
        )}
      </div>
      
      {/* Profile Picture and Name */}
      <div className="relative px-4 pb-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
              <Image
                src={user.profilePicture || getPlaceholderAvatar(user.fullName)}
                alt={user.fullName}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            
            {isCurrentUser && (
              <button
                onClick={handleUploadProfilePicture}
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md"
              >
                <FaCamera />
              </button>
            )}
          </div>
          
          <div className="mt-2 sm:mt-0 sm:ml-4 text-center sm:text-left">
            <h1 className="text-xl font-bold">{user.fullName}</h1>
            {user.friends && (
              <p className="text-xs text-gray-500">
                {user.friends.length} {user.friends.length === 1 ? 'friend' : 'friends'}
              </p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="mt-4 sm:mt-0 sm:ml-auto">
            {isCurrentUser ? (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="fb-button flex items-center"
              >
                <FaEdit className="mr-1" />
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            ) : (
              <>
                {friendRequestStatus === 'none' && (
                  <button
                    onClick={handleSendFriendRequest}
                    disabled={isSubmitting}
                    className="fb-button flex items-center"
                  >
                    <FaUserPlus className="mr-1" />
                    Add Friend
                  </button>
                )}
                
                {friendRequestStatus === 'pending' && (
                  <button
                    disabled
                    className="fb-button-secondary flex items-center"
                  >
                    <FaUserClock className="mr-1" />
                    Friend Request Sent
                  </button>
                )}
                
                {friendRequestStatus === 'friends' && (
                  <button
                    disabled
                    className="fb-button-secondary flex items-center"
                  >
                    <FaUserCheck className="mr-1" />
                    Friends
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Info / Edit Form */}
      <div className="px-4 pb-4 border-t border-gray-200 pt-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="fb-input w-full text-xs"
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="fb-input w-full text-xs"
                placeholder="Where do you live?"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={isSubmitting}
                className="fb-button text-xs"
              >
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {user.bio && (
              <div>
                <h3 className="text-xs font-bold">Bio</h3>
                <p className="text-xs">{user.bio}</p>
              </div>
            )}
            
            {user.location && (
              <div>
                <h3 className="text-xs font-bold">Lives in</h3>
                <p className="text-xs">{user.location}</p>
              </div>
            )}
            
            {user.work && user.work.length > 0 && (
              <div>
                <h3 className="text-xs font-bold">Work</h3>
                {user.work.map((work, index) => (
                  <p key={index} className="text-xs">
                    {work.position} at {work.company} ({work.year})
                  </p>
                ))}
              </div>
            )}
            
            {user.education && user.education.length > 0 && (
              <div>
                <h3 className="text-xs font-bold">Education</h3>
                {user.education.map((edu, index) => (
                  <p key={index} className="text-xs">
                    {edu.degree} at {edu.school} ({edu.year})
                  </p>
                ))}
              </div>
            )}
            
            {!user.bio && !user.location && (!user.work || user.work.length === 0) && (!user.education || user.education.length === 0) && (
              <p className="text-xs text-gray-500 italic">No profile information to display</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
