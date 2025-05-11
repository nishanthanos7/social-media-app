'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post, Comment } from '../../types';
import { formatRelativeTime, getPlaceholderAvatar } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { postsApi } from '../../lib/api';
import CommentSection from './CommentSection';
import { FaThumbsUp, FaHeart, FaLaugh, FaSurprise, FaSadTear, FaAngry, FaShare, FaMapMarkerAlt } from 'react-icons/fa';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const [currentReaction, setCurrentReaction] = useState<string | null>(
    user?.id ?
      (post.reactions.like.includes(user.id) ? 'like' :
       post.reactions.love.includes(user.id) ? 'love' :
       post.reactions.haha.includes(user.id) ? 'haha' :
       post.reactions.wow.includes(user.id) ? 'wow' :
       post.reactions.sad.includes(user.id) ? 'sad' :
       post.reactions.angry.includes(user.id) ? 'angry' : null) : null
  );
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const handleReaction = async (reactionType: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry') => {
    if (!user) return;

    try {
      // If already has this reaction, remove it
      if (currentReaction === reactionType) {
        await postsApi.removeReaction(post.id, reactionType);
        setCurrentReaction(null);
      } else {
        // Otherwise add the new reaction (this will automatically remove any existing reaction)
        await postsApi.addReaction(post.id, reactionType);
        setCurrentReaction(reactionType);
      }
      setShowReactionPicker(false);
    } catch (error) {
      console.error('Error setting reaction:', error);
    }
  };

  const handleShowComments = async () => {
    if (!showComments) {
      setIsLoadingComments(true);
      try {
        const fetchedComments = await postsApi.getComments(post.id);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleShare = async () => {
    if (!user) return;

    try {
      const content = `Sharing ${post.user?.fullName}'s post`;
      await postsApi.sharePost(post.id, content);
      // You might want to refresh the feed or show a success message
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const addNewComment = (comment: Comment) => {
    setComments(prev => [comment, ...prev]);
  };

  // Get total reaction count
  const totalReactions = Object.values(post.reactions).reduce(
    (sum, reactions) => sum + reactions.length, 0
  );

  // Render the appropriate content based on post type
  const renderPostContent = () => {
    switch (post.postType) {
      case 'image':
        return (
          <>
            <div className="p-2 text-xs">
              <p className="whitespace-pre-line">{post.content}</p>
            </div>
            {post.imageUrl && (
              <div className="relative w-full h-48 md:h-64 border-t border-b border-gray-200">
                <Image
                  src={post.imageUrl}
                  alt="Post image"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="w-full"
                />
              </div>
            )}
          </>
        );

      case 'video':
        return (
          <>
            <div className="p-2 text-xs">
              <p className="whitespace-pre-line">{post.content}</p>
            </div>
            {post.videoUrl && (
              <div className="border-t border-b border-gray-200 p-2">
                <video
                  controls
                  className="w-full"
                  src={post.videoUrl}
                />
              </div>
            )}
          </>
        );

      case 'link':
        return (
          <>
            <div className="p-2 text-xs">
              <p className="whitespace-pre-line">{post.content}</p>
            </div>
            {post.linkUrl && (
              <a
                href={post.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-gray-200 rounded overflow-hidden mb-2 hover:bg-gray-50"
              >
                {post.linkImage && (
                  <div className="relative w-full h-32">
                    <Image
                      src={post.linkImage}
                      alt={post.linkTitle || "Link preview"}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className="p-2">
                  <h3 className="font-bold text-xs">{post.linkTitle}</h3>
                  <p className="text-xs text-gray-500 truncate">{post.linkDescription}</p>
                  <p className="text-xs text-gray-400 truncate">{post.linkUrl}</p>
                </div>
              </a>
            )}
          </>
        );

      case 'text':
      default:
        return (
          <div className="p-2 text-xs">
            <p className="whitespace-pre-line">{post.content}</p>
          </div>
        );
    }
  };

  // Render shared post if this is a shared post
  const renderSharedPost = () => {
    if (!post.originalPost) return null;

    return (
      <div className="border border-gray-200 rounded mx-2 mb-2 bg-gray-50">
        <div className="fb-section-header text-xs flex items-center p-2">
          <Link href={`/profile/${post.originalPost.userId}`} className="flex items-center">
            <Image
              src={post.originalPost.user?.profilePicture || getPlaceholderAvatar(post.originalPost.user?.fullName || 'User')}
              alt={post.originalPost.user?.fullName || 'User'}
              width={20}
              height={20}
              className="rounded mr-2"
            />
            <span className="font-bold">{post.originalPost.user?.fullName || 'User'}</span>
          </Link>
          <span className="text-xs text-gray-500 ml-2">
            {formatRelativeTime(post.originalPost.createdAt)}
          </span>
        </div>

        <div className="p-2 text-xs">
          <p className="whitespace-pre-line">{post.originalPost.content}</p>
        </div>

        {post.originalPost.postType === 'image' && post.originalPost.imageUrl && (
          <div className="relative w-full h-32 border-t border-b border-gray-200">
            <Image
              src={post.originalPost.imageUrl}
              alt="Original post image"
              fill
              style={{ objectFit: 'cover' }}
              className="w-full"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fb-content mb-4">
      {/* Post Header */}
      <div className="fb-section-header text-xs flex items-center justify-between p-2">
        <div className="flex items-center">
          <Link href={`/profile/${post.userId}`} className="flex items-center">
            <Image
              src={post.user?.profilePicture || getPlaceholderAvatar(post.user?.fullName || 'User')}
              alt={post.user?.fullName || 'User'}
              width={24}
              height={24}
              className="rounded mr-2"
            />
            <div>
              <span className="font-bold block">{post.user?.fullName || 'User'}</span>
              {post.location && (
                <span className="text-xs text-gray-500 flex items-center">
                  <FaMapMarkerAlt className="mr-1" size={10} />
                  {post.location}
                </span>
              )}
            </div>
          </Link>
        </div>
        <span className="text-xs text-gray-500">
          {formatRelativeTime(post.createdAt)}
        </span>
      </div>

      {/* Post Content */}
      {renderPostContent()}

      {/* Shared Post Content (if this is a shared post) */}
      {post.originalPostId && renderSharedPost()}

      {/* Tagged Users */}
      {post.taggedUsersInfo && post.taggedUsersInfo.length > 0 && (
        <div className="px-2 pb-2 text-xs text-gray-500">
          <span>with </span>
          {post.taggedUsersInfo.map((taggedUser, index) => (
            <React.Fragment key={taggedUser.id}>
              <Link href={`/profile/${taggedUser.id}`} className="font-bold hover:underline">
                {taggedUser.fullName}
              </Link>
              {index < post.taggedUsersInfo.length - 1 && ', '}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Reaction Stats */}
      {totalReactions > 0 && (
        <div className="flex items-center px-2 py-1 text-xs text-gray-500 border-t border-gray-200">
          <div className="flex -space-x-1 mr-1">
            {post.reactions.like.length > 0 && <FaThumbsUp className="text-blue-500" />}
            {post.reactions.love.length > 0 && <FaHeart className="text-red-500" />}
            {post.reactions.haha.length > 0 && <FaLaugh className="text-yellow-500" />}
          </div>
          <span>{totalReactions}</span>

          {post.commentCount > 0 && (
            <span className="ml-auto">{post.commentCount} comment{post.commentCount !== 1 ? 's' : ''}</span>
          )}

          {post.shareCount > 0 && (
            <span className="ml-2">{post.shareCount} share{post.shareCount !== 1 ? 's' : ''}</span>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between p-2 text-xs border-t border-gray-200">
        <div className="flex items-center justify-between w-full">
          {/* Like/React Button */}
          <div className="relative">
            <button
              onClick={() => currentReaction ? handleReaction(currentReaction as any) : setShowReactionPicker(!showReactionPicker)}
              onMouseEnter={() => setShowReactionPicker(true)}
              onMouseLeave={() => setShowReactionPicker(false)}
              className={`fb-link flex items-center ${currentReaction ? 'font-bold' : ''}`}
            >
              {currentReaction === 'like' && <FaThumbsUp className="mr-1 text-blue-500" />}
              {currentReaction === 'love' && <FaHeart className="mr-1 text-red-500" />}
              {currentReaction === 'haha' && <FaLaugh className="mr-1 text-yellow-500" />}
              {currentReaction === 'wow' && <FaSurprise className="mr-1 text-yellow-500" />}
              {currentReaction === 'sad' && <FaSadTear className="mr-1 text-yellow-500" />}
              {currentReaction === 'angry' && <FaAngry className="mr-1 text-orange-500" />}
              {currentReaction || 'Like'}
            </button>

            {/* Reaction Picker */}
            {showReactionPicker && (
              <div
                className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border border-gray-200 p-1 flex space-x-2"
                onMouseEnter={() => setShowReactionPicker(true)}
                onMouseLeave={() => setShowReactionPicker(false)}
              >
                <button onClick={() => handleReaction('like')} className="p-1 hover:scale-125 transition-transform">
                  <FaThumbsUp className="text-blue-500" />
                </button>
                <button onClick={() => handleReaction('love')} className="p-1 hover:scale-125 transition-transform">
                  <FaHeart className="text-red-500" />
                </button>
                <button onClick={() => handleReaction('haha')} className="p-1 hover:scale-125 transition-transform">
                  <FaLaugh className="text-yellow-500" />
                </button>
                <button onClick={() => handleReaction('wow')} className="p-1 hover:scale-125 transition-transform">
                  <FaSurprise className="text-yellow-500" />
                </button>
                <button onClick={() => handleReaction('sad')} className="p-1 hover:scale-125 transition-transform">
                  <FaSadTear className="text-yellow-500" />
                </button>
                <button onClick={() => handleReaction('angry')} className="p-1 hover:scale-125 transition-transform">
                  <FaAngry className="text-orange-500" />
                </button>
              </div>
            )}
          </div>

          {/* Comment Button */}
          <button
            onClick={handleShowComments}
            className="fb-link"
          >
            Comment
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="fb-link flex items-center"
          >
            <FaShare className="mr-1" size={12} />
            Share
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-200">
          <CommentSection
            postId={post.id}
            comments={comments}
            isLoading={isLoadingComments}
            onAddComment={addNewComment}
          />
        </div>
      )}
    </div>
  );
}
