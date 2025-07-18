'use client';

import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { WishListPage } from '@/features/wishes/pages/WishListPage';

export default function WishesPage() {
  return (
    <AuthGuard>
      <WishListPage />
    </AuthGuard>
  );
}
