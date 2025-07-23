'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdsService } from '@/lib/adsService';
import { AdPreferences } from '@/components/ui/AdPlacement';
import { AdBlockerDetector } from '@/components/ui/AdUnit';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';

interface AdAnalytics {
  id: string;
  adUnitId: string;
  impressions: number;
  clicks: number;
  revenue: number;
  ctr: number;
  rpm: number;
  lastImpression?: any;
  lastClick?: any;
  lastUpdated: any;
}

export default function AdsAdminPage() {
  const { user, isAdmin } = useAuth();
  const [analytics, setAnalytics] = useState<AdAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    '7d' | '30d' | '90d'
  >('30d');

  useEffect(() => {
    if (isAdmin) {
      loadAnalytics();
    }
  }, [isAdmin, selectedTimeframe]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await AdsService.getAllAdAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Error loading ad analytics:', err);
      setError('Failed to load ad analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalRevenue = () => {
    return analytics.reduce((sum, item) => sum + (item.revenue || 0), 0);
  };

  const calculateTotalImpressions = () => {
    return analytics.reduce((sum, item) => sum + (item.impressions || 0), 0);
  };

  const calculateTotalClicks = () => {
    return analytics.reduce((sum, item) => sum + (item.clicks || 0), 0);
  };

  const calculateAverageCTR = () => {
    const totalImpressions = calculateTotalImpressions();
    const totalClicks = calculateTotalClicks();
    return totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  };

  if (!isAdmin) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Access Denied
          </h1>
          <p className='text-gray-600'>
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Ad Management</h1>
          <p className='mt-2 text-gray-600'>
            Monitor and manage your advertising performance
          </p>
        </div>

        {/* Ad Blocker Detection */}
        <div className='mb-8'>
          <AdBlockerDetector />
        </div>

        {/* Timeframe Selector */}
        <div className='mb-6'>
          <div className='flex space-x-2'>
            <Button
              variant={selectedTimeframe === '7d' ? 'primary' : 'outline'}
              size='sm'
              onClick={() => setSelectedTimeframe('7d')}
            >
              7 Days
            </Button>
            <Button
              variant={selectedTimeframe === '30d' ? 'primary' : 'outline'}
              size='sm'
              onClick={() => setSelectedTimeframe('30d')}
            >
              30 Days
            </Button>
            <Button
              variant={selectedTimeframe === '90d' ? 'primary' : 'outline'}
              size='sm'
              onClick={() => setSelectedTimeframe('90d')}
            >
              90 Days
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                    />
                  </svg>
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-500'>
                  Total Impressions
                </p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {isLoading
                    ? '...'
                    : calculateTotalImpressions().toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 7l5 5m0 0l-5 5m5-5H6'
                    />
                  </svg>
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-500'>
                  Total Clicks
                </p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {isLoading ? '...' : calculateTotalClicks().toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-yellow-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                    />
                  </svg>
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-500'>CTR</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {isLoading ? '...' : calculateAverageCTR().toFixed(2) + '%'}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-purple-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                    />
                  </svg>
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-500'>Revenue</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {isLoading ? '...' : '$' + calculateTotalRevenue().toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Table */}
        <div className='bg-white rounded-lg shadow'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h2 className='text-lg font-medium text-gray-900'>
              Ad Unit Performance
            </h2>
          </div>

          {isLoading ? (
            <div className='p-6'>
              <Loading />
            </div>
          ) : error ? (
            <div className='p-6 text-center'>
              <p className='text-red-600'>{error}</p>
              <Button onClick={loadAnalytics} className='mt-4'>
                Retry
              </Button>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Ad Unit
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Impressions
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Clicks
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      CTR
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Revenue
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      RPM
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Last Activity
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {analytics.map(item => (
                    <tr key={item.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {item.adUnitId}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {item.impressions?.toLocaleString() || 0}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {item.clicks?.toLocaleString() || 0}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {item.ctr ? item.ctr.toFixed(2) + '%' : '0.00%'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        ${item.revenue?.toFixed(2) || '0.00'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        ${item.rpm?.toFixed(2) || '0.00'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {item.lastUpdated
                          ? new Date(
                              item.lastUpdated.toDate()
                            ).toLocaleDateString()
                          : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Ad Preferences */}
        <div className='mt-8'>
          <AdPreferences />
        </div>
      </div>
    </div>
  );
}
