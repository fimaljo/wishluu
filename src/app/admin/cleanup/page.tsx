'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useFirebaseWishes } from '@/hooks/useFirebaseWishes';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function CleanupPage() {
  const { cleanupExpiredWishes } = useFirebaseWishes();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleCleanup = async () => {
    setIsLoading(true);
    setResult('');

    try {
      console.log('Starting cleanup process...');
      const response = await cleanupExpiredWishes();
      console.log('Cleanup response:', response);

      if (response.success) {
        setResult(`✅ Successfully cleaned up ${response.data} expired wishes`);
      } else {
        setResult(`❌ Error: ${response.error}`);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
      setResult(`❌ Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard requireAdmin={true}>
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8'>
        <div className='max-w-2xl mx-auto'>
          <div className='bg-white rounded-2xl shadow-lg p-8'>
            <h1 className='text-3xl font-bold text-gray-800 mb-6'>
              🧹 Cleanup Expired Wishes
            </h1>

            <div className='mb-6'>
              <p className='text-gray-600 mb-4'>
                This will permanently delete all wishes that have expired (older
                than 7 days).
              </p>
              <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                <p className='text-yellow-800 text-sm'>
                  ⚠️ <strong>Warning:</strong> This action cannot be undone.
                  Expired wishes will be permanently deleted.
                </p>
              </div>
            </div>

            <div className='space-y-4'>
              <Button
                onClick={handleCleanup}
                disabled={isLoading}
                variant='primary'
                className='w-full'
              >
                {isLoading ? 'Cleaning up...' : 'Clean Up Expired Wishes'}
              </Button>

              {result && (
                <div
                  className={`p-4 rounded-lg ${
                    result.includes('✅')
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  {result}
                </div>
              )}
            </div>

            <div className='mt-8 pt-6 border-t border-gray-200'>
              <h2 className='text-lg font-semibold text-gray-800 mb-3'>
                How it works:
              </h2>
              <ul className='text-sm text-gray-600 space-y-2'>
                <li>• Wishes automatically expire 7 days after creation</li>
                <li>• Expired wishes are hidden from user views</li>
                <li>
                  • This cleanup permanently removes expired wishes from the
                  database
                </li>
                <li>• You can run this manually or set up automated cleanup</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
