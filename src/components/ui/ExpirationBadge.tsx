import React from 'react';

interface ExpirationBadgeProps {
  expiresAt: any;
  className?: string;
}

export function ExpirationBadge({
  expiresAt,
  className = '',
}: ExpirationBadgeProps) {
  console.log('ExpirationBadge received expiresAt:', expiresAt);
  if (!expiresAt) {
    console.log('ExpirationBadge: No expiresAt, returning null');
    return null;
  }

  const expirationDate = expiresAt.toDate
    ? expiresAt.toDate()
    : new Date(expiresAt);
  const now = new Date();
  const diffTime = expirationDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 ${className}`}
      >
        <span className='w-2 h-2 bg-red-400 rounded-full mr-1'></span>
        Expired
      </div>
    );
  }

  if (diffDays <= 1) {
    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 ${className}`}
      >
        <span className='w-2 h-2 bg-orange-400 rounded-full mr-1'></span>
        Expires today
      </div>
    );
  }

  if (diffDays <= 3) {
    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ${className}`}
      >
        <span className='w-2 h-2 bg-yellow-400 rounded-full mr-1'></span>
        Expires in {diffDays} days
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ${className}`}
    >
      <span className='w-2 h-2 bg-green-400 rounded-full mr-1'></span>
      {diffDays} days left
    </div>
  );
}
