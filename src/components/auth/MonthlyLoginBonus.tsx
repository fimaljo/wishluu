'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumManagement } from '@/hooks/usePremiumManagement';

export function MonthlyLoginBonus() {
  const { user } = useAuth();
  const { claimMonthlyLoginBonus } = usePremiumManagement();
  const [showBonus, setShowBonus] = useState(false);
  const [bonusMessage, setBonusMessage] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    // Only run when user logs in
    if (user && !isClaiming) {
      handleMonthlyLoginBonus();
    }
  }, [user]); // Only depend on user, not the claim function

  const handleMonthlyLoginBonus = async () => {
    if (!user || isClaiming) return;

    try {
      setIsClaiming(true);
      const result = await claimMonthlyLoginBonus();

      if (result.claimed) {
        setBonusMessage(result.message);
        setShowBonus(true);

        // Hide the bonus message after 5 seconds
        setTimeout(() => {
          setShowBonus(false);
        }, 5000);
      }
      // Don't show popup if already claimed - let manual button handle that
    } catch (error) {
      console.error('Error claiming monthly login bonus:', error);
      // Don't show error to user as this is a background process
    } finally {
      setIsClaiming(false);
    }
  };

  if (!showBonus) return null;

  return (
    <div className='fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-300'>
      <div className='flex items-center space-x-2'>
        <div className='text-2xl'>🎉</div>
        <div>
          <div className='font-semibold'>Monthly Login Bonus!</div>
          <div className='text-sm opacity-90'>{bonusMessage}</div>
        </div>
        <button
          onClick={() => setShowBonus(false)}
          className='ml-4 text-white hover:text-gray-200 transition-colors'
        >
          ✕
        </button>
      </div>
    </div>
  );
}
