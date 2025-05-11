'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Comment } from '../../types';
import { formatRelativeTime, getPlaceholderAvatar } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { postsApi } from '../../lib/api';
import { FaThumbsUp, FaHeart, FaReply } from 'react-icons/fa';

interface CommentSectionProps {
  postId: number;
  comments: Comment[];
  isLoading: boolean;
  onAddComment: (comment: Comment) => void;
}

// Helper function to organize comments into a tree structure
const organizeComments = (comments: Comment[]): Comment[] => {
  const commentMap = new Map<number, Comment>();
  const rootComments: Comment[] = [];

  // First pass: create a map of all comments
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: organize into parent-child relationships
  comments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id);
    if (commentWithReplies) {
      if (comment.parentId && commentMap.has(comment.parentId)) {
        // This is a reply, add it to its parent's replies
        const parent = commentMap.get(comment.parentId);
        parent.replies.push(commentWithReplies);
      } else {
        // This is a root comment
        rootComments.push(commentWithReplies);
      }
    }
  });

  return rootComments;
};

// Single comment component
const CommentItem = ({ comment, postId, level = 0 }: { comment: Comment, postId: number, level?: number }) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<string | null>(
    user?.id ?
      (comment.reactions.like.includes(user.id) ? 'like' :
       comment.reactions.love.includes(user.id) ? 'love' : null) : null
  );

  const handleReaction = async (reactionType: 'like' | 'love') => {
    if (!user) return;

    try {
      if (currentReaction === reactionType) {
        await postsApi.removeCommentReaction(comment.id, reactionType);
        setCurrentReaction(null);
      } else {
        await postsApi.addCommentReaction(comment.id, reactionType);
        setCurrentReaction(reactionType);
      }
    } catch (error) {
      console.error('Error setting comment reaction:', error);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !user) return;

    setIsSubmittingReply(true);
    try {
      await postsApi.addComment(postId, replyContent, comment.id);
      setReplyContent('');
      setShowReplyForm(false);
      // In a real app, you would update the UI with the new reply
      // This would require lifting state up or using a more sophisticated state management solution
    } catch (error) {
      console.error('Error adding reply:', error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Calculate total reactions
  const totalReactions = comment.reactions.like.length + comment.reactions.love.length;

  return (
    <div className={`flex items-start ${level > 0 ? 'ml-6 mt-2' : 'mb-3'}`}>
      <Link href={`/profile/${comment.userId}`} className="shrink-0">
        <Image
          src={comment.user?.profilePicture || getPlaceholderAvatar(comment.user?.fullName || 'User')}
          alt={comment.user?.fullName || 'User'}
          width={24}
          height={24}
          className="rounded mr-1"
        />
      </Link>
      <div className="flex-grow">
        <div className="bg-gray-100 rounded-sm p-1 text-xs">
          <Link href={`/profile/${comment.userId}`} className="font-bold fb-link">
            {comment.user?.fullName || 'User'}
          </Link>{' '}
          <span>{comment.content}</span>

          {/* Reaction indicators */}
          {totalReactions > 0 && (
            <div className="flex items-center justify-end -mb-3 mr-1">
              <div className="bg-white rounded-full shadow-sm px-1 py-0.5 flex items-center text-[10px]">
                {comment.reactions.like.length > 0 && <FaThumbsUp className="text-blue-500 mr-0.5" size={8} />}
                {comment.reactions.love.length > 0 && <FaHeart className="text-red-500 mr-0.5" size={8} />}
                <span>{totalReactions}</span>
              </div>
            </div>
          )}
        </div>

        {/* Comment actions */}
        <div className="text-[10px] text-gray-500 mt-0.5 ml-1 flex items-center">
          {formatRelativeTime(comment.createdAt)} ·

          <button
            onClick={() => handleReaction('like')}
            className={`fb-link ml-1 ${currentReaction === 'like' ? 'font-bold text-blue-500' : ''}`}
          >
            Like
          </button>

          <button
            onClick={() => handleReaction('love')}
            className={`fb-link ml-1 ${currentReaction === 'love' ? 'font-bold text-red-500' : ''}`}
          >
            Love
          </button>

          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="fb-link ml-1"
          >
            Reply
          </button>
        </div>

        {/* Reply form */}
        {showReplyForm && (
          <form onSubmit={handleSubmitReply} className="flex items-start mt-1">
            <div className="flex-grow">
              <div className="flex">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Reply to ${comment.user?.fullName}...`}
                  className="fb-input w-full text-xs"
                />
                <button
                  type="submit"
                  disabled={isSubmittingReply || !replyContent.trim()}
                  className="fb-button ml-1 text-xs"
                >
                  {isSubmittingReply ? '...' : 'Reply'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-1">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} postId={postId} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function CommentSection({
  postId,
  comments,
  isLoading,
  onAddComment
}: CommentSectionProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Organize comments into a tree structure
  const organizedComments = organizeComments(comments);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const comment = await postsApi.addComment(postId, newComment);
      onAddComment(comment);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2">
      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-2">
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-1 text-xs text-gray-500">Loading comments...</p>
        </div>
      ) : organizedComments.length > 0 ? (
        <div className="space-y-2 mb-3">
          {organizedComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))}
        </div>
      ) : (
        <p className="text-center text-xs text-gray-500 py-2">No comments yet. Be the first to comment!</p>
      )}

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="flex items-start">
        <Link href={`/profile/${user?.id}`} className="shrink-0">
          <Image
            src={user?.profilePicture || getPlaceholderAvatar(user?.fullName || 'User')}
            alt={user?.fullName || 'User'}
            width={24}
            height={24}
            className="rounded mr-1"
          />
        </Link>
        <div className="flex-grow">
          <div className="flex">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="fb-input w-full text-xs"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="fb-button ml-1 text-xs"
            >
              {isSubmitting ? '...' : 'Comment'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
