'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Loading } from './Loading';
import { useFirebaseComments } from '@/hooks/useFirebaseComments';
import { useAuth } from '@/contexts/AuthContext';
import { CommentData } from '@/lib/firebaseCommentService';

interface LocalComment {
  id: string;
  name: string;
  message: string;
  timestamp: Date;
  isAnonymous: boolean;
}

interface CommentWallProps {
  postType: 'photo' | 'video';
  mediaUrl: string;
  postDescription: string;
  wishId?: string; // Add wishId for Firebase integration
  onClick?: () => void;
}

export function CommentWall({
  postType,
  mediaUrl,
  postDescription,
  wishId,
  onClick,
}: CommentWallProps) {
  // Default styling values
  const backgroundColor = '#FFFFFF';
  const textColor = '#1A202C';
  const accentColor = '#0095F6';
  const borderRadius = 20;
  const maxWidth = '100%';
  const allowAnonymous = true;
  const showTimestamps = true;
  const showUserAvatars = true;
  const showCommentCount = true;

  const [newComment, setNewComment] = useState({
    name: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showMedia, setShowMedia] = useState(true);

  // Local comments state for creation/editing phase
  const [localComments, setLocalComments] = useState<LocalComment[]>([]);

  // Firebase integration - only when wishId is provided (after sharing)
  const { user } = useAuth();
  const {
    comments: firebaseComments,
    isLoading: commentsLoading,
    error: commentsError,
    createComment,
    deleteComment,
    stats,
  } = useFirebaseComments(wishId || '');

  // Use Firebase comments if wishId is provided, otherwise use local comments
  const comments = wishId ? firebaseComments : localComments;
  const isLoading = wishId ? commentsLoading : false;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.message.trim()) return;

    setIsSubmitting(true);

    try {
      const isAnonymous = !newComment.name.trim();
      const commentData: CommentData = {
        name: isAnonymous ? 'Anonymous' : newComment.name,
        message: newComment.message,
        isAnonymous: isAnonymous,
        // Remove userAvatar generation - we don't need to store this
      };

      if (wishId) {
        // Use Firebase when wishId is provided (after sharing)
        console.log('Creating Firebase comment with wishId:', wishId);
        console.log('Comment data:', commentData);

        const result = await createComment(commentData);

        console.log('Firebase result:', result);

        if (result.success) {
          setNewComment({ name: '', message: '' });
          setShowCommentForm(false);
          console.log('Comment created successfully');
        } else {
          console.error('Failed to create comment:', result.error);
          // Show error to user
          alert(`Failed to create comment: ${result.error}`);
        }
      } else {
        // Use local state during creation/editing
        const newLocalComment: LocalComment = {
          id: Date.now().toString(),
          ...commentData,
          timestamp: new Date(),
        };

        setLocalComments(prev => [...prev, newLocalComment]);
        setNewComment({ name: '', message: '' });
        setShowCommentForm(false);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewAllComments = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent slide navigation
    setShowAllComments(true);
    setShowMedia(false);
  };

  const handleHideComments = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent slide navigation
    setShowAllComments(false);
    setShowMedia(true);
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const getCommentTimestamp = (comment: any) => {
    if (wishId) {
      // Firebase comment
      return comment.createdAt.toDate();
    } else {
      // Local comment
      return comment.timestamp;
    }
  };

  const isYouTubeUrl = (url: string): boolean => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeEmbedUrl = (url: string): string => {
    let videoId = '';

    try {
      // Handle youtu.be format
      if (url.includes('youtu.be/')) {
        const match = url.match(/youtu\.be\/([^?]+)/);
        videoId = match ? match[1] || '' : '';
      }
      // Handle youtube.com/watch format
      else if (url.includes('youtube.com/watch')) {
        const match = url.match(/[?&]v=([^&]+)/);
        videoId = match ? match[1] || '' : '';
      }

      console.log('YouTube URL:', url);
      console.log('Extracted Video ID:', videoId);

      if (!videoId) {
        console.error('Could not extract video ID from URL:', url);
        return '';
      }

      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
      return '';
    }
  };

  const handleMediaLoad = () => {
    setIsMediaLoading(false);
    setMediaError(false);
  };

  const handleMediaError = () => {
    setIsMediaLoading(false);
    setMediaError(true);
  };

  useEffect(() => {
    if (mediaUrl) {
      setIsMediaLoading(true);
      setMediaError(false);
    }
  }, [mediaUrl]);

  const containerStyle = {
    backgroundColor: '#FFFFFF',
    color: textColor,
    borderRadius: `${borderRadius}px`,
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  };

  return (
    <div
      className='instagram-post w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl relative z-10'
      style={containerStyle}
      onClick={e => {
        e.stopPropagation(); // Prevent slide navigation
        onClick?.();
      }}
    >
      {/* Shimmer Widget - Media Section */}
      {showMedia && (
        <div
          className='shimmer-widget relative'
          onClick={e => e.stopPropagation()}
        >
          {mediaUrl ? (
            <>
              {isMediaLoading && (
                <div className='w-full h-48 sm:h-64 md:h-80 bg-gray-200 flex items-center justify-center'>
                  <div className='text-center'>
                    <div className='text-2xl sm:text-3xl mb-2 opacity-50'>
                      {postType === 'video' ? '🎥' : '📷'}
                    </div>
                    <div className='text-xs sm:text-sm text-gray-500'>
                      Loading...
                    </div>
                  </div>
                </div>
              )}

              {postType === 'photo' ? (
                <img
                  src={mediaUrl}
                  alt='Post media'
                  className={`w-full h-48 sm:h-64 md:h-80 object-cover ${isMediaLoading ? 'hidden' : ''} ${mediaError ? 'hidden' : ''}`}
                  onLoad={handleMediaLoad}
                  onError={handleMediaError}
                />
              ) : isYouTubeUrl(mediaUrl) ? (
                <div
                  className={`w-full h-48 sm:h-64 md:h-80 ${isMediaLoading ? 'hidden' : ''} ${mediaError ? 'hidden' : ''}`}
                >
                  {getYouTubeEmbedUrl(mediaUrl) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(mediaUrl)}
                      title='YouTube video'
                      className='w-full h-full'
                      frameBorder='0'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                      onLoad={handleMediaLoad}
                      onError={handleMediaError}
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center bg-gray-100'>
                      <div className='text-center'>
                        <div className='text-2xl sm:text-3xl mb-2 opacity-50'>
                          🎥
                        </div>
                        <div className='text-xs sm:text-sm text-gray-500'>
                          Invalid YouTube URL
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <video
                  src={mediaUrl}
                  controls
                  preload='metadata'
                  playsInline
                  className={`w-full h-48 sm:h-64 md:h-80 object-contain bg-black ${isMediaLoading ? 'hidden' : ''} ${mediaError ? 'hidden' : ''}`}
                  onLoadStart={() => setIsMediaLoading(true)}
                  onLoadedData={handleMediaLoad}
                  onError={handleMediaError}
                  onCanPlay={() => setIsMediaLoading(false)}
                />
              )}

              {mediaError && !isMediaLoading && (
                <div className='w-full h-48 sm:h-64 md:h-80 flex items-center justify-center bg-gray-100'>
                  <div className='text-center'>
                    <div className='text-2xl sm:text-3xl mb-2 opacity-50'>
                      {postType === 'video' ? '🎥' : '📷'}
                    </div>
                    <div className='text-xs sm:text-sm text-gray-500'>
                      Media could not be loaded
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Static placeholder when no media is available
            <div className='w-full h-48 sm:h-64 md:h-80 bg-gray-100 flex items-center justify-center'>
              <div className='text-center'>
                <div className='text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-4 opacity-30'>
                  {postType === 'video' ? '🎥' : '📷'}
                </div>
                <div className='text-xs sm:text-sm text-gray-400'>
                  No media added
                </div>
                <div className='text-xs text-gray-300 mt-1'>
                  Add a photo or video link
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Description Section */}
      {showMedia && (
        <div
          className='post-caption p-3 sm:p-4 border-b'
          style={{ borderColor: `${textColor}20` }}
          onClick={e => e.stopPropagation()}
        >
          <div className='text-xs sm:text-sm' style={{ color: textColor }}>
            {postDescription || 'Share your thoughts and memories here...'}
          </div>
          {showTimestamps && (
            <div
              className='text-xs opacity-60 mt-2'
              style={{ color: textColor }}
            >
              {formatTimestamp(new Date())}
            </div>
          )}
        </div>
      )}

      {/* Comments Section */}
      {showAllComments ? (
        <div
          className='comments-full-view min-h-[300px] sm:min-h-[400px]'
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className='p-3 sm:p-4 border-b bg-white'
            style={{ borderColor: `${textColor}20` }}
          >
            <div className='flex items-center justify-between'>
              <h3
                className='text-xs sm:text-sm font-semibold'
                style={{ color: textColor }}
              >
                Comments ({comments.length})
              </h3>
              <button
                onClick={handleHideComments}
                className='text-xs opacity-70 hover:opacity-100 transition-opacity'
                style={{ color: textColor }}
              >
                ← Back to post
              </button>
            </div>
          </div>

          {/* Scrollable Comments List */}
          <div className='max-h-96 overflow-y-auto bg-white'>
            {comments.map(comment => (
              <div
                key={comment.id}
                className='comment-item p-3 sm:p-4 border-b last:border-b-0 bg-white'
                style={{ borderColor: `${textColor}20` }}
              >
                <div className='flex gap-3'>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span
                        className='font-semibold text-xs sm:text-sm'
                        style={{ color: textColor }}
                      >
                        {comment.name}
                      </span>
                    </div>
                    <p
                      className='text-xs sm:text-sm mb-2'
                      style={{ color: textColor }}
                    >
                      {comment.message}
                    </p>
                    <div
                      className='flex items-center gap-4 text-xs opacity-60'
                      style={{ color: textColor }}
                    >
                      {showTimestamps && (
                        <span>
                          {formatTimestamp(getCommentTimestamp(comment))}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Default View - Show first comment and view all button */
        comments.length > 0 && (
          <div
            className='p-3 sm:p-4 border-b bg-white'
            style={{ borderColor: `${textColor}20` }}
            onClick={e => e.stopPropagation()}
          >
            <div className='space-y-3'>
              {/* Show only first comment */}
              {comments[0] && (
                <div className='comment-item'>
                  <div className='flex gap-3'>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 mb-1'>
                        <span
                          className='font-semibold text-xs sm:text-sm'
                          style={{ color: textColor }}
                        >
                          {comments[0].name}
                        </span>
                      </div>
                      <p
                        className='text-xs sm:text-sm mb-2'
                        style={{ color: textColor }}
                      >
                        {comments[0].message}
                      </p>
                      <div
                        className='flex items-center gap-4 text-xs opacity-60'
                        style={{ color: textColor }}
                      >
                        {showTimestamps && (
                          <span>
                            {formatTimestamp(getCommentTimestamp(comments[0]))}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* View all comments button */}
              {comments.length > 1 && (
                <button
                  onClick={handleViewAllComments}
                  className='w-full text-left text-xs sm:text-sm opacity-70 hover:opacity-100 transition-all duration-200 hover:bg-gray-50 rounded-lg p-2 -m-2'
                  style={{ color: textColor }}
                >
                  View all {comments.length} comments
                </button>
              )}
            </div>
          </div>
        )
      )}

      {/* Comments Section */}
      <div className='comments-section' onClick={e => e.stopPropagation()}>
        {/* Comment Form */}
        {!showCommentForm ? (
          <div
            className='p-3 sm:p-4 border-b bg-white'
            style={{ borderColor: `${textColor}20` }}
          >
            <button
              onClick={e => {
                e.stopPropagation();
                setShowCommentForm(true);
              }}
              className='w-full text-left text-xs sm:text-sm opacity-70 hover:opacity-100 transition-all duration-200 hover:bg-gray-50 rounded-lg p-2 -m-2 cursor-pointer'
              style={{ color: textColor }}
            >
              💬 Add a comment...
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmitComment}
            className='p-3 sm:p-4 border-b bg-white'
            style={{ borderColor: `${textColor}20` }}
          >
            <div className='space-y-3'>
              <input
                type='text'
                value={newComment.name}
                onChange={e =>
                  setNewComment(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder='Your name (optional)'
                className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm transition-all duration-200'
                style={{
                  borderColor: `${textColor}20`,
                  backgroundColor: backgroundColor,
                  color: textColor,
                }}
                disabled={isSubmitting}
                onClick={e => e.stopPropagation()}
              />
              <textarea
                value={newComment.message}
                onChange={e =>
                  setNewComment(prev => ({ ...prev, message: e.target.value }))
                }
                placeholder='Share your thoughts...'
                className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-sm transition-all duration-200'
                style={{
                  borderColor: `${textColor}20`,
                  backgroundColor: backgroundColor,
                  color: textColor,
                }}
                rows={2}
                maxLength={200}
                required
                disabled={isSubmitting}
                onClick={e => e.stopPropagation()}
              />
              <div className='flex items-center justify-end'>
                <div className='flex gap-2'>
                  <button
                    type='button'
                    onClick={e => {
                      e.stopPropagation();
                      setShowCommentForm(false);
                      setNewComment({ name: '', message: '' });
                    }}
                    className='px-3 py-1 rounded text-sm transition-all duration-200 hover:bg-gray-100 cursor-pointer'
                    style={{ color: textColor }}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={isSubmitting || !newComment.message.trim()}
                    className='px-3 py-1 rounded text-sm font-medium transition-all duration-200 cursor-pointer'
                    style={{
                      backgroundColor: newComment.message.trim()
                        ? accentColor
                        : `${textColor}20`,
                      color: newComment.message.trim() ? '#fff' : textColor,
                      opacity: newComment.message.trim() ? 1 : 0.5,
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    {isSubmitting ? <Loading size='sm' /> : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* No Comments Message */}
        {comments.length === 0 && (
          <div
            className='p-3 sm:p-4 text-center text-xs sm:text-sm opacity-60 bg-white'
            style={{ color: textColor }}
          >
            No comments yet. Be the first to share!
          </div>
        )}
      </div>
    </div>
  );
}
