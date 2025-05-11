'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { postsApi } from '../../lib/api';
import { Post } from '../../types';
import { getPlaceholderAvatar } from '../../lib/utils';
import { FaImage, FaVideo, FaLink, FaMapMarkerAlt, FaUserTag, FaGlobe, FaLock, FaUserFriends } from 'react-icons/fa';

interface CreatePostFormProps {
  onPostCreated: (post: Post) => void;
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'text' | 'image' | 'video' | 'link'>('text');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  const [linkImage, setLinkImage] = useState('');
  const [location, setLocation] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExpandClick = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setContent('');
    setPostType('text');
    setImageUrl('');
    setVideoUrl('');
    setLinkUrl('');
    setLinkTitle('');
    setLinkDescription('');
    setLinkImage('');
    setLocation('');
    setPrivacy('public');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const linkData = postType === 'link' ? {
        url: linkUrl,
        title: linkTitle,
        description: linkDescription,
        image: linkImage
      } : undefined;

      const newPost = await postsApi.createPost(
        content,
        postType,
        postType === 'image' ? imageUrl : undefined,
        postType === 'video' ? videoUrl : undefined,
        linkData,
        location || undefined,
        [], // Tagged users - would need a user selection UI
        privacy
      );

      // Reset form and notify parent
      handleCancel();
      onPostCreated(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to a server and get a URL back
      // For this demo, we'll just use a placeholder
      const randomId = Math.floor(Math.random() * 1000);
      setImageUrl(`https://picsum.photos/id/${randomId}/800/600`);
      setPostType('image');
    }
  };

  const handleLinkSubmit = () => {
    if (!linkUrl) return;

    // In a real app, you would fetch metadata from the URL
    // For this demo, we'll just use placeholders
    const randomId = Math.floor(Math.random() * 1000);
    setLinkTitle(`Link Title ${randomId}`);
    setLinkDescription('This is a description of the linked content.');
    setLinkImage(`https://picsum.photos/id/${randomId}/800/600`);
    setPostType('link');
  };

  return (
    <div className="fb-content mb-4">
      <div className="p-2 border-b border-gray-200">
        <h3 className="text-sm font-bold">Create Post</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-2 flex items-start">
          <Image
            src={user?.profilePicture || getPlaceholderAvatar(user?.fullName || 'User')}
            alt={user?.fullName || 'User'}
            width={40}
            height={40}
            className="rounded-full mr-2"
          />

          {!isExpanded ? (
            <input
              type="text"
              placeholder={`What's on your mind, ${user?.fullName?.split(' ')[0]}?`}
              className="fb-input w-full text-sm"
              onClick={handleExpandClick}
              readOnly
            />
          ) : (
            <div className="flex-grow">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`What's on your mind, ${user?.fullName?.split(' ')[0]}?`}
                className="fb-input w-full text-sm min-h-[100px] resize-none"
                autoFocus
              />

              {/* Media preview */}
              {postType === 'image' && imageUrl && (
                <div className="mt-2 relative">
                  <div className="relative w-full h-48 border border-gray-200 rounded overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt="Post image"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1"
                    onClick={() => { setImageUrl(''); setPostType('text'); }}
                  >
                    ✕
                  </button>
                </div>
              )}

              {postType === 'video' && videoUrl && (
                <div className="mt-2">
                  <video controls className="w-full rounded border border-gray-200">
                    <source src={videoUrl} />
                  </video>
                </div>
              )}

              {postType === 'link' && linkUrl && (
                <div className="mt-2 border border-gray-200 rounded overflow-hidden">
                  {linkImage && (
                    <div className="relative w-full h-32">
                      <Image
                        src={linkImage}
                        alt={linkTitle || "Link preview"}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div className="p-2">
                    <h3 className="font-bold text-xs">{linkTitle}</h3>
                    <p className="text-xs text-gray-500 truncate">{linkDescription}</p>
                    <p className="text-xs text-gray-400 truncate">{linkUrl}</p>
                  </div>
                </div>
              )}

              {/* Location */}
              {location && (
                <div className="mt-2 flex items-center text-xs text-gray-600">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{location}</span>
                </div>
              )}

              {/* Privacy setting */}
              <div className="mt-2 flex items-center text-xs text-gray-600">
                {privacy === 'public' && <FaGlobe className="mr-1" />}
                {privacy === 'friends' && <FaUserFriends className="mr-1" />}
                {privacy === 'private' && <FaLock className="mr-1" />}
                <span>
                  {privacy === 'public' ? 'Public' :
                   privacy === 'friends' ? 'Friends' : 'Only me'}
                </span>
              </div>

              {/* Add to post options */}
              <div className="mt-3 border border-gray-200 rounded p-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold">Add to your post</span>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="text-green-500 hover:bg-gray-100 p-1 rounded"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FaImage />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />

                    <button
                      type="button"
                      className="text-red-500 hover:bg-gray-100 p-1 rounded"
                      onClick={() => {
                        setPostType('video');
                        setVideoUrl('https://example.com/video.mp4'); // Placeholder
                      }}
                    >
                      <FaVideo />
                    </button>

                    <button
                      type="button"
                      className="text-blue-500 hover:bg-gray-100 p-1 rounded"
                      onClick={() => {
                        setLinkUrl('https://example.com');
                        handleLinkSubmit();
                      }}
                    >
                      <FaLink />
                    </button>

                    <button
                      type="button"
                      className="text-yellow-500 hover:bg-gray-100 p-1 rounded"
                      onClick={() => setLocation('Current Location')}
                    >
                      <FaMapMarkerAlt />
                    </button>

                    <button
                      type="button"
                      className="text-blue-500 hover:bg-gray-100 p-1 rounded"
                    >
                      <FaUserTag />
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy selector */}
              <div className="mt-2">
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value as any)}
                  className="fb-input text-xs w-full"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends</option>
                  <option value="private">Only me</option>
                </select>
              </div>

              {/* Action buttons */}
              <div className="mt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="fb-button-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="fb-button text-xs"
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
