'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CustomWishBuilder } from '@/features/wish-builder/components/CustomWishBuilder';

export default function TemplateBuilderPage() {
  const params = useParams();
  const templateId = params.template as string;

  // Determine if this is template mode (not custom-blank)
  const isTemplateMode = templateId !== 'custom-blank';

  return (
    <CustomWishBuilder
      onBack={() => (window.location.href = '/')}
      templateId={templateId}
      isTemplateMode={isTemplateMode}
    />
  );
}
