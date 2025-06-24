'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CustomWishBuilder } from '@/features/templates/components/CustomWishBuilder';

export default function TemplateBuilderPage() {
  const params = useParams();
  const templateId = params.template as string;

  return (
    <CustomWishBuilder 
      onBack={() => window.location.href = '/'} 
      templateId={templateId}
    />
  );
} 