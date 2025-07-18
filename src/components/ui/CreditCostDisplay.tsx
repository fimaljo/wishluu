'use client';

import React from 'react';
import { WishElement } from '@/types/templates';
import {
  calculateTotalCreditCost,
  calculateTemplateCreditCost,
  CreditBreakdown,
} from '@/lib/creditCalculator';

interface CreditCostDisplayProps {
  elements: WishElement[];
  showBreakdown?: boolean;
  className?: string;
  isTemplateMode?: boolean;
}

export function CreditCostDisplay({
  elements,
  showBreakdown = false,
  className = '',
  isTemplateMode = false,
}: CreditCostDisplayProps) {
  const breakdown = isTemplateMode
    ? calculateTemplateCreditCost(elements)
    : calculateTotalCreditCost(elements);

  if (breakdown.totalCost === 0) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className='flex items-center space-x-1'>
        <span className='text-yellow-500'>💎</span>
        <span className='text-sm font-medium text-gray-700'>
          {breakdown.totalCost.toFixed(2)} credits
        </span>
      </div>

      {showBreakdown && breakdown.details.length > 0 && (
        <div className='text-xs text-gray-500'>
          {!isTemplateMode &&
            breakdown.elementCost > 0 &&
            `${breakdown.elementCost.toFixed(2)} elements`}
          {!isTemplateMode &&
            breakdown.elementCost > 0 &&
            (breakdown.propertyCosts.total || 0) > 0 &&
            ' + '}
          {(breakdown.propertyCosts.total || 0) > 0 &&
            `${(breakdown.propertyCosts.total || 0).toFixed(2)} premium features`}
          {isTemplateMode &&
            (breakdown.propertyCosts.total || 0) > 0 &&
            ' (template premium features)'}
        </div>
      )}
    </div>
  );
}

interface PremiumPropertyBadgeProps {
  propertyName: string;
  propertyValue: string;
  cost: number;
  className?: string;
}

export function PremiumPropertyBadge({
  propertyName,
  propertyValue,
  cost,
  className = '',
}: PremiumPropertyBadgeProps) {
  return (
    <div
      className={`inline-flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-xs rounded-full border border-yellow-200 ${className}`}
    >
      <span className='text-yellow-500'>💎</span>
      <span className='font-medium'>{propertyName}:</span>
      <span>{propertyValue}</span>
      <span className='text-yellow-600'>({cost.toFixed(2)})</span>
    </div>
  );
}

interface ElementCreditBreakdownProps {
  element: WishElement;
  className?: string;
}

export function ElementCreditBreakdown({
  element,
  className = '',
}: ElementCreditBreakdownProps) {
  const breakdown = calculateTotalCreditCost([element]);

  if (breakdown.totalCost === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium text-gray-700'>
          {breakdown.details[0]?.elementName}
        </span>
        <div className='flex items-center space-x-1'>
          <span className='text-yellow-500'>💎</span>
          <span className='text-sm font-medium text-gray-700'>
            {breakdown.totalCost.toFixed(2)} credits
          </span>
        </div>
      </div>

      {breakdown.details[0]?.premiumProperties &&
        breakdown.details[0].premiumProperties.length > 0 && (
          <div className='space-y-1'>
            {breakdown.details[0].premiumProperties.map((prop, index) => (
              <PremiumPropertyBadge
                key={index}
                propertyName={prop.propertyName}
                propertyValue={prop.propertyValue}
                cost={prop.cost}
              />
            ))}
          </div>
        )}
    </div>
  );
}
