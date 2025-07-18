'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Basic text elements',
        'Standard fonts (Inter, Poppins, etc.)',
        'Basic animations (fade, slide, zoom)',
        'Standard colors and sizes',
        'Up to 3 wishes per month',
        'Community templates',
      ],
      limitations: [
        'No premium fonts',
        'No advanced animations',
        'No gradient effects',
        'No custom backgrounds',
        'Limited templates',
      ],
      buttonText: 'Current Plan',
      buttonStyle: 'bg-gray-100 text-gray-600 cursor-not-allowed',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      description: 'Perfect for creators and enthusiasts',
      popular: true,
      features: [
        'Everything in Free',
        'Premium fonts (Dancing Script, Pacifico, etc.)',
        'Advanced animations (3D Flip, Rotate, Typewriter)',
        'Gradient text effects',
        'Custom background colors',
        'Unlimited wishes',
        'Premium templates',
        'Priority support',
        'Export high quality',
        'Remove watermarks',
      ],
      buttonText: 'Upgrade to Pro',
      buttonStyle:
        'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$19.99',
      period: 'per month',
      description: 'For professionals and businesses',
      features: [
        'Everything in Pro',
        'Exclusive premium fonts',
        'Custom animations',
        'Advanced color palettes',
        'Team collaboration',
        'Analytics dashboard',
        'API access',
        'White-label options',
        'Priority support 24/7',
        'Custom branding',
      ],
      buttonText: 'Upgrade to Premium',
      buttonStyle:
        'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600',
    },
  ];

  const premiumFeatures = [
    {
      category: 'Typography',
      icon: '✍️',
      features: [
        { name: 'Dancing Script', description: 'Elegant cursive font' },
        { name: 'Pacifico', description: 'Playful handwritten style' },
        { name: 'Great Vibes', description: 'Sophisticated script' },
        { name: 'Satisfy', description: 'Casual handwritten' },
        { name: 'Kaushan Script', description: 'Artistic brush style' },
        { name: 'Allura', description: 'Elegant calligraphy' },
      ],
    },
    {
      category: 'Animations',
      icon: '✨',
      features: [
        { name: '3D Flip', description: 'Three-dimensional flip effect' },
        { name: 'Rotate', description: 'Smooth rotation animation' },
        { name: 'Typewriter', description: 'Character-by-character typing' },
        { name: 'Bounce', description: 'Playful bouncing motion' },
        { name: 'Pulse', description: 'Breathing pulse effect' },
      ],
    },
    {
      category: 'Effects',
      icon: '🎨',
      features: [
        { name: 'Gradient Text', description: 'Multi-color text gradients' },
        {
          name: 'Custom Backgrounds',
          description: 'Personalized background colors',
        },
        {
          name: 'Advanced Shadows',
          description: 'Sophisticated shadow effects',
        },
        { name: 'Blur Effects', description: 'Background blur and focus' },
      ],
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      {/* Header */}
      <div className='bg-white/70 backdrop-blur-sm border-b border-purple-100'>
        <div className='max-w-6xl mx-auto px-6 py-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
                Upgrade to Premium
              </h1>
              <p className='text-gray-600 text-lg'>
                Unlock advanced features and create stunning wishes
              </p>
            </div>
            <Link
              href='/templates'
              className='px-6 py-3 text-purple-600 hover:text-purple-700 font-medium transition-colors border border-purple-200 rounded-xl hover:bg-purple-50'
            >
              ← Back to Templates
            </Link>
          </div>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-6 py-16'>
        {/* Pricing Plans */}
        <div className='mb-20'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Choose Your Plan
            </h2>
            <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
              Start with our free plan and upgrade when you need more features.
              All plans include our core functionality with premium plans
              unlocking advanced features.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl shadow-xl border transition-all duration-300 hover:shadow-2xl ${
                  plan.popular
                    ? 'border-purple-500 scale-105 shadow-2xl'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                {plan.popular && (
                  <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                    <span className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg'>
                      Most Popular
                    </span>
                  </div>
                )}

                <div className='p-10'>
                  <div className='text-center mb-8'>
                    <h3 className='text-2xl font-bold text-gray-900 mb-3'>
                      {plan.name}
                    </h3>
                    <div className='mb-3'>
                      <span className='text-5xl font-bold text-gray-900'>
                        {plan.price}
                      </span>
                      <span className='text-gray-500 ml-2 text-lg'>
                        {plan.period}
                      </span>
                    </div>
                    <p className='text-gray-600'>{plan.description}</p>
                  </div>

                  <div className='space-y-4 mb-10'>
                    {plan.features.map((feature, index) => (
                      <div key={index} className='flex items-center'>
                        <div className='w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4'>
                          <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                        </div>
                        <span className='text-gray-700'>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations && (
                    <div className='space-y-3 mb-10 p-6 bg-gray-50 rounded-2xl'>
                      <h4 className='text-sm font-semibold text-gray-700 mb-3'>
                        Limitations:
                      </h4>
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className='flex items-center'>
                          <div className='w-5 h-5 text-gray-400 mr-3'>×</div>
                          <span className='text-sm text-gray-500'>
                            {limitation}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 ${plan.buttonStyle}`}
                    disabled={plan.id === 'free'}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Features Showcase */}
        <div className='mb-20'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Premium Features
            </h2>
            <p className='text-gray-600 text-lg'>
              Discover what you can create with our premium features
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
            {premiumFeatures.map(category => (
              <div
                key={category.category}
                className='bg-white rounded-3xl shadow-xl p-8 border border-gray-100'
              >
                <div className='text-center mb-8'>
                  <div className='text-4xl mb-4'>{category.icon}</div>
                  <h3 className='text-xl font-bold text-gray-900'>
                    {category.category}
                  </h3>
                </div>
                <div className='space-y-4'>
                  {category.features.map(feature => (
                    <div key={feature.name} className='text-center'>
                      <div className='font-semibold text-gray-900 mb-1'>
                        {feature.name}
                      </div>
                      <div className='text-gray-500 text-sm'>
                        {feature.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className='bg-white rounded-3xl shadow-xl p-12 border border-gray-100'>
          <h2 className='text-3xl font-bold text-gray-900 mb-12 text-center'>
            Frequently Asked Questions
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
            <div>
              <h3 className='font-semibold text-gray-900 mb-3 text-lg'>
                Can I cancel anytime?
              </h3>
              <p className='text-gray-600'>
                Yes, you can cancel your subscription at any time. You'll
                continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className='font-semibold text-gray-900 mb-3 text-lg'>
                What payment methods do you accept?
              </h3>
              <p className='text-gray-600'>
                We accept all major credit cards, PayPal, and Apple Pay. All
                payments are processed securely.
              </p>
            </div>
            <div>
              <h3 className='font-semibold text-gray-900 mb-3 text-lg'>
                Do you offer refunds?
              </h3>
              <p className='text-gray-600'>
                We offer a 30-day money-back guarantee. If you're not satisfied,
                contact us for a full refund.
              </p>
            </div>
            <div>
              <h3 className='font-semibold text-gray-900 mb-3 text-lg'>
                Can I upgrade or downgrade?
              </h3>
              <p className='text-gray-600'>
                Yes, you can change your plan at any time. Changes take effect
                immediately and are prorated.
              </p>
            </div>
          </div>
        </div>

        <div className='text-center mt-16'>
          <p className='text-gray-600 mb-6'>
            Unlock unlimited wishes, premium templates, and advanced
            customization options. Make every celebration extraordinary!
          </p>
          <p className='text-gray-600 mb-8'>
            Upgrade now and start creating wishes that&apos;ll be remembered
            forever. Your loved ones deserve the best!
          </p>
        </div>
      </div>
    </div>
  );
}
