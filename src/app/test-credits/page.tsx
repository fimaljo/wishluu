'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { premiumApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function TestCreditsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addTestCredits = async (amount: number) => {
    if (!user?.uid) {
      setMessage('Please sign in first');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = (await premiumApi.addCredits(
        amount,
        `Test credits added: ${amount} credits`,
        'bonus'
      )) as any;

      if (result.success) {
        setMessage(`✅ Successfully added ${amount} credits!`);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCreditCheck = async () => {
    if (!user?.uid) {
      setMessage('Please sign in first');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Check user status and credits
      const userResult = (await premiumApi.getStatus()) as any;
      if (!userResult.success) {
        setMessage(`❌ User not found: ${userResult.error}`);
        return;
      }

      const { credits } = userResult.data;
      const required = 2; // Cost for premium wish
      const hasEnough = credits >= required;

      setMessage(
        `Credit Check: ${hasEnough ? '✅' : '❌'} Need ${required}, have ${credits} credits`
      );
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testUseCredits = async () => {
    if (!user?.uid) {
      setMessage('Please sign in first');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = (await premiumApi.useCredits(
        'premium_wish',
        'Test credit usage',
        'test-wish-id'
      )) as any;

      if (result.success) {
        setMessage('✅ Successfully used 2 credits for premium wish!');
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserExists = async () => {
    if (!user?.uid) {
      setMessage('Please sign in first');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = (await premiumApi.getStatus()) as any;

      if (result.success) {
        const userData = result.data;
        setMessage(
          `✅ User exists! Plan: ${userData.planType}, Credits: ${userData.credits}, Premium: ${userData.isPremium ? 'Yes' : 'No'}`
        );
      } else {
        setMessage(`❌ User not found: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getCreditHistory = async () => {
    if (!user?.uid) {
      setMessage('Please sign in first');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = (await premiumApi.getCreditHistory()) as any;

      if (result.success) {
        const transactions = result.data;
        setMessage(
          `✅ Credit History: ${transactions.length} transactions found. Latest: ${transactions[0]?.description || 'None'}`
        );
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testJwtApi = async () => {
    if (!user?.uid) {
      setMessage('Please sign in first');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Test the JWT-authenticated API
      const result = (await premiumApi.getStatus()) as any;

      if (result.success) {
        const userData = result.data;
        setMessage(
          `✅ JWT API Test Success! Plan: ${userData.planType}, Credits: ${userData.credits}, Premium: ${userData.isPremium ? 'Yes' : 'No'}`
        );
      } else {
        setMessage(`❌ JWT API Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ JWT API Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testMonthlyLoginBonus = async () => {
    if (!user?.uid) {
      setMessage('Please sign in first');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = (await premiumApi.claimMonthlyLoginBonus()) as any;

      if (result.success) {
        const bonusData = result.data;
        if (bonusData.claimed) {
          setMessage(
            `🎉 Monthly Login Bonus Claimed! +${bonusData.creditsAdded} credits added to your account.\n\n${bonusData.message}`
          );
        } else {
          setMessage(
            `💡 ${bonusData.message}\n\nYou can claim your next bonus on the 1st of next month.`
          );
        }
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Credit System Test
          </h1>
          <p className='text-gray-600 mb-6'>
            Please sign in to test the credit system.
          </p>
          <div className='text-sm text-gray-500'>
            <p>This page is for development testing only.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Credit System Test
          </h1>
          <p className='text-gray-600 mb-4'>
            Development testing page for the premium credit system
          </p>
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
            <h2 className='text-lg font-semibold text-blue-800 mb-2'>
              Current User
            </h2>
            <p className='text-sm text-blue-700'>
              <strong>Email:</strong> {user.email}
              <br />
              <strong>ID:</strong> {user.uid}
            </p>
          </div>
        </div>

        {/* Test Controls */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Credit Management */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Credit Management
            </h2>

            <div className='space-y-4'>
              <div>
                <h3 className='text-lg font-medium text-gray-800 mb-2'>
                  Add Test Credits
                </h3>
                <div className='flex space-x-2'>
                  <Button
                    onClick={() => addTestCredits(10)}
                    disabled={isLoading}
                    className='bg-green-600 hover:bg-green-700'
                  >
                    Add 10 Credits
                  </Button>
                  <Button
                    onClick={() => addTestCredits(50)}
                    disabled={isLoading}
                    className='bg-green-600 hover:bg-green-700'
                  >
                    Add 50 Credits
                  </Button>
                  <Button
                    onClick={() => addTestCredits(100)}
                    disabled={isLoading}
                    className='bg-green-600 hover:bg-green-700'
                  >
                    Add 100 Credits
                  </Button>
                </div>
              </div>

              <div>
                <h3 className='text-lg font-medium text-gray-800 mb-2'>
                  Test Credit Usage
                </h3>
                <div className='flex space-x-2'>
                  <Button
                    onClick={testUseCredits}
                    disabled={isLoading}
                    className='bg-red-600 hover:bg-red-700'
                  >
                    Use 2 Credits (Premium Wish)
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Checks */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Credit Checks
            </h2>

            <div className='space-y-4'>
              <div>
                <h3 className='text-lg font-medium text-gray-800 mb-2'>
                  Check Credit Balance
                </h3>
                <Button
                  onClick={testCreditCheck}
                  disabled={isLoading}
                  className='bg-blue-600 hover:bg-blue-700'
                >
                  Check Credits for Premium Wish
                </Button>
              </div>

              <div>
                <h3 className='text-lg font-medium text-gray-800 mb-2'>
                  User Status
                </h3>
                <Button
                  onClick={checkUserExists}
                  disabled={isLoading}
                  className='bg-purple-600 hover:bg-purple-700'
                >
                  Check User Status
                </Button>
              </div>

              <div>
                <h3 className='text-lg font-medium text-gray-800 mb-2'>
                  Transaction History
                </h3>
                <Button
                  onClick={getCreditHistory}
                  disabled={isLoading}
                  className='bg-indigo-600 hover:bg-indigo-700'
                >
                  Get Credit History
                </Button>
              </div>

              <div>
                <h3 className='text-lg font-medium text-gray-800 mb-2'>
                  JWT API Test
                </h3>
                <Button
                  onClick={testJwtApi}
                  disabled={isLoading}
                  className='bg-green-600 hover:bg-green-700'
                >
                  Test JWT Authentication
                </Button>
              </div>

              <div>
                <h3 className='text-lg font-medium text-gray-800 mb-2'>
                  Monthly Login Bonus
                </h3>
                <Button
                  onClick={testMonthlyLoginBonus}
                  disabled={isLoading}
                  className='bg-yellow-600 hover:bg-yellow-700'
                >
                  🎁 Test Monthly Login Bonus
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {message && (
          <div className='mt-6 bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Test Results
            </h2>
            <div className='bg-gray-50 rounded-lg p-4'>
              <p className='text-sm font-mono whitespace-pre-wrap'>{message}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className='mt-6 bg-white rounded-lg shadow-md p-6'>
            <div className='flex items-center justify-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
              <span className='ml-3 text-gray-700'>Processing...</span>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className='mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6'>
          <h2 className='text-lg font-semibold text-yellow-800 mb-2'>
            Testing Instructions
          </h2>
          <div className='text-sm text-yellow-700 space-y-2'>
            <p>
              1. <strong>Add Credits:</strong> Start by adding some test credits
              to your account
            </p>
            <p>
              2. <strong>Check Balance:</strong> Verify your credit balance is
              updated
            </p>
            <p>
              3. <strong>Test Usage:</strong> Try using credits for a premium
              wish
            </p>
            <p>
              4. <strong>Check History:</strong> View your transaction history
            </p>
            <p>
              5. <strong>Verify Deduction:</strong> Confirm credits are properly
              deducted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
