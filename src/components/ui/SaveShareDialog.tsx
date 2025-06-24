'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Wish } from '@/types';

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
  const [activeTab, setActiveTab] = useState<'save' | 'share'>('save');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && wish) {
      setRecipientName(wish.recipientName || '');
      setMessage(wish.message || '');
      setIsPublic(wish.isPublic !== false);
    }
  }, [isOpen, wish]);

  const handleSave = async () => {
    if (!recipientName.trim() || !message.trim()) {
      alert('Please fill in recipient name and message before saving.');
      return;
    }

    const wishData = {
      ...wish,
      recipientName: recipientName.trim(),
      message: message.trim(),
      isPublic,
    };

    const savedWish = await onSave(wishData);
    if (savedWish) {
      // Generate share URL
      const url = await onShare(savedWish);
      setShareUrl(url);
      setActiveTab('share');
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
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold'>Save & Share Your Wish</h2>
            <button
              onClick={onClose}
              className='text-white hover:text-gray-200 transition-colors'
            >
              <svg
                className='w-6 h-6'
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

          {/* Tabs */}
          <div className='flex space-x-1 mt-4'>
            <button
              onClick={() => setActiveTab('save')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'save'
                  ? 'bg-white text-purple-600'
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              💾 Save
            </button>
            <button
              onClick={() => setActiveTab('share')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'share'
                  ? 'bg-white text-purple-600'
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              📤 Share
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(90vh-120px)]'>
          {activeTab === 'save' ? (
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Recipient Name *
                </label>
                <input
                  type='text'
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  placeholder='Who is this wish for?'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Your Message *
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder='Write your heartfelt message...'
                  rows={4}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none'
                />
              </div>

              <div className='flex items-center space-x-3'>
                <input
                  type='checkbox'
                  id='isPublic'
                  checked={isPublic}
                  onChange={e => setIsPublic(e.target.checked)}
                  className='w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded'
                />
                <label htmlFor='isPublic' className='text-sm text-gray-700'>
                  Make this wish public (can be shared with anyone)
                </label>
              </div>

              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <div className='flex items-start space-x-3'>
                  <div className='text-blue-500 text-xl'>💡</div>
                  <div>
                    <h4 className='font-medium text-blue-900 mb-1'>Pro Tip</h4>
                    <p className='text-sm text-blue-700'>
                      {isPublic
                        ? "Public wishes can be shared with anyone using the link. They'll also appear in our public gallery."
                        : 'Private wishes are only accessible to people with the direct link.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className='flex space-x-3'>
                <Button
                  variant='primary'
                  onClick={handleSave}
                  disabled={
                    isSaving || !recipientName.trim() || !message.trim()
                  }
                  className='flex-1'
                >
                  {isSaving ? 'Saving...' : 'Save Wish'}
                </Button>
                <Button variant='outline' onClick={onClose} className='flex-1'>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className='space-y-6'>
              {shareUrl ? (
                <>
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
                        className='flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50'
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
                          className='border border-gray-300 rounded-lg'
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
                        Scan this QR code to open the wish on mobile devices
                      </p>
                    </div>
                  </div>

                  {/* Share Methods */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-3'>
                      Share via
                    </label>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                      {shareMethods.map(method => (
                        <button
                          key={method.id}
                          onClick={method.action}
                          className={`flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all ${method.color} text-white`}
                        >
                          <span className='text-lg'>{method.icon}</span>
                          <span className='text-sm font-medium'>
                            {method.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview Link */}
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h4 className='font-medium text-gray-900 mb-1'>
                          Preview Your Wish
                        </h4>
                        <p className='text-sm text-gray-600'>
                          See how your wish will look to others
                        </p>
                      </div>
                      <Button
                        variant='primary'
                        onClick={() => window.open(shareUrl, '_blank')}
                      >
                        Open Preview
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className='text-center py-8'>
                  <div className='text-6xl mb-4'>💾</div>
                  <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                    Save Your Wish First
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    You need to save your wish before you can share it
                  </p>
                  <Button
                    variant='primary'
                    onClick={() => setActiveTab('save')}
                  >
                    Go to Save Tab
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
