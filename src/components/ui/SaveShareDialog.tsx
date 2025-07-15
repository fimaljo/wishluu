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
    if (!recipientName.trim()) {
      alert('Please enter a recipient name before saving.');
      return;
    }

    const wishData = {
      ...wish,
      recipientName: recipientName.trim(),
      message: message.trim() || '',
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

  const handleSaveAndShare = async () => {
    if (!recipientName.trim()) {
      alert('Please enter a recipient name before saving.');
      return;
    }

    const wishData = {
      ...wish,
      recipientName: recipientName.trim(),
      message: message.trim() || '',
      isPublic: true, // Force public for sharing
    };

    console.log('Saving wish data:', wishData);
    const savedWish = await onSave(wishData);
    console.log('Saved wish result:', savedWish);

    if (savedWish) {
      // Generate share URL
      const url = await onShare(savedWish);
      console.log('Generated share URL:', url);
      setShareUrl(url);
      setActiveTab('share');
    } else {
      console.error('Failed to save wish - no result returned');
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
              {/* Recipient Name Section */}
              <div className='bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6'>
                <div className='flex items-center space-x-3 mb-4'>
                  <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white font-bold'>👤</span>
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-800'>
                      Recipient Information
                    </h3>
                    <p className='text-sm text-gray-600'>
                      Who is this special wish for?
                    </p>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Recipient Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    placeholder='Enter the name of the person this wish is for...'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg'
                    autoFocus
                  />
                  {!recipientName.trim() && (
                    <p className='text-sm text-red-600 mt-1'>
                      ⚠️ Please enter a recipient name to continue
                    </p>
                  )}
                </div>
              </div>

              {/* Message Section */}
              <div className='bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6'>
                <div className='flex items-center space-x-3 mb-4'>
                  <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
                    <span className='text-white font-bold'>💌</span>
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-800'>
                      Your Message
                    </h3>
                    <p className='text-sm text-gray-600'>
                      Add a personal touch to your wish (optional)
                    </p>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Personal Message
                  </label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder='Write a heartfelt message for your recipient...'
                    rows={4}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                  />
                </div>
              </div>

              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <div className='flex items-start space-x-3'>
                  <div className='text-blue-500 text-xl'>💡</div>
                  <div>
                    <h4 className='font-medium text-blue-900 mb-1'>
                      Save Options
                    </h4>
                    <p className='text-sm text-blue-700'>
                      Choose how you want to save your wish. You can save it
                      privately or make it public for sharing.
                    </p>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Private Save Option */}
                <div className='border border-gray-200 rounded-lg p-4'>
                  <div className='flex items-center space-x-3 mb-3'>
                    <input
                      type='radio'
                      id='private'
                      name='saveType'
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                      className='w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300'
                    />
                    <label
                      htmlFor='private'
                      className='font-medium text-gray-800'
                    >
                      🔒 Private Save
                    </label>
                  </div>
                  <p className='text-sm text-gray-600 mb-3'>
                    Save your wish privately. Only you can access it from your
                    dashboard.
                  </p>
                  <Button
                    variant='outline'
                    onClick={handleSave}
                    disabled={isSaving || !recipientName.trim()}
                    className='w-full'
                  >
                    {isSaving
                      ? 'Saving...'
                      : !recipientName.trim()
                        ? 'Enter Recipient Name'
                        : 'Save Privately'}
                  </Button>
                </div>

                {/* Public Save & Share Option */}
                <div className='border border-purple-200 rounded-lg p-4 bg-purple-50'>
                  <div className='flex items-center space-x-3 mb-3'>
                    <input
                      type='radio'
                      id='public'
                      name='saveType'
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                      className='w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300'
                    />
                    <label
                      htmlFor='public'
                      className='font-medium text-gray-800'
                    >
                      🌐 Public & Share
                    </label>
                  </div>
                  <p className='text-sm text-gray-600 mb-3'>
                    Save and get a shareable link to send to your recipient.
                  </p>
                  <Button
                    variant='primary'
                    onClick={handleSaveAndShare}
                    disabled={isSaving || !recipientName.trim()}
                    className='w-full'
                  >
                    {isSaving
                      ? 'Saving...'
                      : !recipientName.trim()
                        ? 'Enter Recipient Name'
                        : 'Save & Share'}
                  </Button>
                </div>
              </div>

              <div className='flex justify-center'>
                <Button variant='outline' onClick={onClose}>
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
