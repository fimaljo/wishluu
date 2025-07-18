'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Wish } from '@/types';
import { useNotification } from './Notification';

interface SaveShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  wish: Wish | null;
  onSave: (wishData: any) => Promise<Wish | null>;
  onShare: (wish: Wish) => Promise<string>;
  isSaving: boolean;
}

interface ShareMethod {
  id: string;
  name: string;
  icon: string;
  color: string;
  action: () => void;
}

export function SaveShareDialog({
  isOpen,
  onClose,
  wish,
  onSave,
  onShare,
  isSaving,
}: SaveShareDialogProps) {
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const { showInfo } = useNotification();

  useEffect(() => {
    if (isOpen && wish) {
      setRecipientName(wish.recipientName || '');
      setMessage(wish.message || '');
    }
  }, [isOpen, wish]);

  const handleShare = async () => {
    if (!recipientName.trim()) {
      showInfo('Please enter a recipient name before sharing.');
      return;
    }

    const wishData = {
      ...wish,
      recipientName: recipientName.trim(),
      message: message.trim() || '',
      isPublic: true, // Always public for sharing
    };

    const savedWish = await onSave(wishData);
    if (savedWish) {
      // Generate share URL
      const url = await onShare(savedWish);
      setShareUrl(url);
    }
  };

  const handleCopyLink = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const generateQRCode = async (url: string) => {
    try {
      // Using a free QR code API
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
      setQrCodeUrl(qrApiUrl);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    }
  };

  const shareMethods: ShareMethod[] = [
    {
      id: 'copy',
      name: 'Copy Link',
      icon: '📋',
      color: 'bg-blue-500',
      action: handleCopyLink,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-green-500',
      action: () => {
        if (shareUrl) {
          const text = `Check out this beautiful wish I created for you! ${shareUrl}`;
          window.open(
            `https://wa.me/?text=${encodeURIComponent(text)}`,
            '_blank'
          );
        }
      },
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-600',
      action: () => {
        if (shareUrl) {
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            '_blank'
          );
        }
      },
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: '🐦',
      color: 'bg-blue-400',
      action: () => {
        if (shareUrl) {
          const text = `Check out this beautiful wish I created! ${shareUrl}`;
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
            '_blank'
          );
        }
      },
    },
    {
      id: 'email',
      name: 'Email',
      icon: '📧',
      color: 'bg-gray-500',
      action: () => {
        if (shareUrl) {
          const subject = 'A Special Wish for You';
          const body = `I created a beautiful wish for you! Check it out here: ${shareUrl}`;
          window.open(
            `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
          );
        }
      },
    },
    {
      id: 'sms',
      name: 'SMS',
      icon: '📱',
      color: 'bg-green-600',
      action: () => {
        if (shareUrl) {
          const text = `Check out this beautiful wish I created for you! ${shareUrl}`;
          window.open(`sms:?body=${encodeURIComponent(text)}`);
        }
      },
    },
  ];

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden border border-gray-100'>
        {/* Header */}
        <div className='bg-gradient-to-br from-purple-50 to-pink-50 border-b border-gray-100 p-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Share Your Wish
            </h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(85vh-120px)]'>
          {!shareUrl ? (
            <div className='space-y-6'>
              {/* Recipient Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Recipient Name *
                </label>
                <input
                  type='text'
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  placeholder='Who is this wish for?'
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base'
                  autoFocus
                />
                {!recipientName.trim() && (
                  <p className='text-sm text-red-500 mt-1 flex items-center'>
                    <span className='mr-1'>⚠️</span>
                    Please enter a recipient name
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Personal Message
                  <span className='text-gray-400 font-normal ml-1'>
                    (optional)
                  </span>
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder='Add a heartfelt message...'
                  rows={3}
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all'
                />
              </div>

              {/* Action Buttons */}
              <div className='flex space-x-3 pt-4'>
                <Button variant='outline' onClick={onClose} className='flex-1'>
                  Cancel
                </Button>
                <Button
                  variant='primary'
                  onClick={handleShare}
                  disabled={isSaving || !recipientName.trim()}
                  className='flex-1'
                >
                  {isSaving ? 'Publishing...' : 'Publish & Share'}
                </Button>
              </div>
            </div>
          ) : (
            <div className='space-y-6'>
              {/* Share URL */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Share Link
                </label>
                <div className='flex space-x-2'>
                  <input
                    type='text'
                    value={shareUrl}
                    readOnly
                    className='flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm'
                  />
                  <Button
                    variant={copied ? 'primary' : 'outline'}
                    onClick={handleCopyLink}
                    className='whitespace-nowrap'
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  QR Code
                </label>
                <div className='flex items-center space-x-4'>
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt='QR Code'
                      className='border border-gray-200 rounded-xl'
                    />
                  ) : (
                    <Button
                      variant='outline'
                      onClick={() => generateQRCode(shareUrl)}
                    >
                      Generate QR Code
                    </Button>
                  )}
                  <p className='text-sm text-gray-600'>
                    Scan to open on mobile
                  </p>
                </div>
              </div>

              {/* Share Methods */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-3'>
                  Share via
                </label>
                <div className='grid grid-cols-2 gap-2'>
                  {shareMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={method.action}
                      className={`flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all ${method.color} text-white text-sm`}
                    >
                      <span className='text-base'>{method.icon}</span>
                      <span className='font-medium'>{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className='bg-gray-50 rounded-xl p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='font-medium text-gray-900'>Preview</h4>
                    <p className='text-sm text-gray-600'>See how it looks</p>
                  </div>
                  <Button
                    variant='primary'
                    onClick={() => window.open(shareUrl, '_blank')}
                  >
                    Open
                  </Button>
                </div>
              </div>

              {/* Done Button */}
              <div className='pt-4'>
                <Button variant='outline' onClick={onClose} className='w-full'>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
