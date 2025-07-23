'use client';

import React, { useState } from 'react';
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
  showDetailedBreakdown?: boolean;
}

export function CreditCostDisplay({
  elements,
  showBreakdown = false,
  className = '',
  isTemplateMode = false,
  showDetailedBreakdown = false,
}: CreditCostDisplayProps) {
  const breakdown = isTemplateMode
    ? calculateTemplateCreditCost(elements)
    : calculateTotalCreditCost(elements);
  const [showDetails, setShowDetails] = useState(false);

  if (breakdown.totalCost === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Main Credit Display */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
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

        {/* Toggle Details Button */}
        {showDetailedBreakdown && breakdown.details.length > 0 && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className='text-xs text-blue-600 hover:text-blue-800 underline'
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        )}
      </div>

      {/* Detailed Breakdown */}
      {showDetailedBreakdown && showDetails && breakdown.details.length > 0 && (
        <div className='bg-gray-50 rounded-lg p-3 space-y-3'>
          <div className='text-xs font-medium text-gray-700 border-b border-gray-200 pb-1'>
            Credit Breakdown
          </div>

          {breakdown.details.map((detail, index) => (
            <div key={index} className='space-y-2'>
              {/* Element Name and Cost */}
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-800'>
                  {detail.elementName}
                </span>
                <div className='flex items-center space-x-1'>
                  <span className='text-yellow-500 text-xs'>💎</span>
                  <span className='text-sm font-medium text-gray-700'>
                    {detail.elementCost.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Premium Properties */}
              {detail.premiumProperties &&
                detail.premiumProperties.length > 0 && (
                  <div className='ml-4 space-y-1'>
                    {detail.premiumProperties.map((prop, propIndex) => (
                      <div
                        key={propIndex}
                        className='flex items-center justify-between text-xs'
                      >
                        <div className='flex items-center space-x-2'>
                          <span className='text-gray-500'>•</span>
                          <span className='text-gray-600'>
                            {prop.propertyName}:
                          </span>
                          <span className='text-gray-700 font-medium'>
                            {prop.propertyValue}
                          </span>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <span className='text-yellow-500 text-xs'>💎</span>
                          <span className='text-gray-600'>
                            {prop.cost.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}

          {/* Total Summary */}
          <div className='border-t border-gray-200 pt-2'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-semibold text-gray-800'>Total</span>
              <div className='flex items-center space-x-1'>
                <span className='text-yellow-500'>💎</span>
                <span className='text-sm font-semibold text-gray-800'>
                  {breakdown.totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
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
