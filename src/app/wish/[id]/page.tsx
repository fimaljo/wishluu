'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InteractiveBalloons } from '@/components/ui/InteractiveBalloons';
import { BeautifulText } from '@/components/ui/BeautifulText';

interface WishData {
  id: string;
  recipientName: string;
  occasion: string;
  message: string;
  theme: string;
  animation: string;
  createdAt: string;
  senderName?: string;
  elements?: any[]; // Canvas elements from the builder
  customBackgroundColor?: string; // Custom background color
}

export default function WishPage({ params }: { params: { id: string } }) {
  const [wish, setWish] = useState<WishData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const occasions = {
    birthday: { label: 'Birthday', emoji: '🎂', color: 'from-pink-400 to-rose-500' },
    valentine: { label: "Valentine's Day", emoji: '💕', color: 'from-red-400 to-pink-500' },
    'mothers-day': { label: "Mother's Day", emoji: '🌷', color: 'from-purple-400 to-pink-500' },
    proposal: { label: 'Proposal', emoji: '💍', color: 'from-blue-400 to-purple-500' },
    anniversary: { label: 'Anniversary', emoji: '💑', color: 'from-green-400 to-blue-500' },
    graduation: { label: 'Graduation', emoji: '🎓', color: 'from-yellow-400 to-orange-500' },
    'thank-you': { label: 'Thank You', emoji: '🙏', color: 'from-indigo-400 to-purple-500' },
    congratulations: { label: 'Congratulations', emoji: '🎉', color: 'from-cyan-400 to-blue-500' },
  };

  const themes = {
    purple: 'from-purple-400 to-pink-400',
    ocean: 'from-blue-400 to-cyan-400',
    sunset: 'from-orange-400 to-pink-400',
    forest: 'from-green-400 to-emerald-400',
    royal: 'from-yellow-400 to-orange-400',
  };

  useEffect(() => {
    // Simulate loading wish data
    setTimeout(() => {
      setWish({
        id: params.id,
        recipientName: 'Sarah',
        occasion: 'birthday',
        message: 'Happy Birthday, Sarah! 🎉\n\nOn this special day, I want you to know how much joy and happiness you bring to everyone around you. Your smile lights up every room you enter, and your kindness touches the hearts of all who know you.\n\nMay this year bring you countless moments of laughter, love, and beautiful memories. You deserve all the wonderful things life has to offer!\n\nWith love and warmest wishes,\nYour Secret Admirer 💕',
        theme: 'purple',
        animation: 'fade',
        createdAt: new Date().toISOString(),
        senderName: 'Your Secret Admirer'
      });
      setIsLoading(false);
    }, 1000);
  }, [params.id]);

  const handleOpenWish = () => {
    setShowMessage(true);
    setShowConfetti(true);
    
    // Hide confetti after 3 seconds
    setTimeout(() => setShowConfetti(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your special wish...</p>
        </div>
      </div>
    );
  }

  if (!wish) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Wish Not Found</h1>
          <p className="text-gray-600 mb-6">This wish may have been deleted or the link is incorrect.</p>
          <Link 
            href="/"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300"
          >
            Create Your Own Wish
          </Link>
        </div>
      </div>
    );
  }

  const occasionData = occasions[wish.occasion as keyof typeof occasions];
  const themeGradient = themes[wish.theme as keyof typeof themes];

  // Render custom elements from the builder
  const renderCustomElements = () => {
    if (!wish.elements || wish.elements.length === 0) {
      return null;
    }

    return (
      <div className="relative w-full h-full min-h-[400px]">
        {/* Background */}
        {wish.customBackgroundColor ? (
          <div 
            className="absolute inset-0 opacity-60"
            style={{ backgroundColor: wish.customBackgroundColor }}
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${themeGradient} opacity-60`} />
        )}
        
        {/* Custom Elements */}
        {wish.elements.map((element) => {
          const { properties } = element;
          
          switch (element.elementType) {
            case 'balloons-interactive':
              return (
                <div
                  key={element.id}
                  className="absolute inset-0 w-full h-full"
                >
                  <InteractiveBalloons
                    numberOfBalloons={properties.numberOfBalloons || 5}
                    balloonColors={properties.balloonColors || ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']}
                    imageUrl={properties.imageUrl || null}
                    balloonSize={properties.balloonSize || 60}
                    startAnimation={true}
                    resetAnimation={false}
                    onBalloonPop={(balloonId) => {
                      console.log(`Balloon ${balloonId} popped!`);
                    }}
                    balloonImages={Array.from({ length: properties.numberOfBalloons || 5 }, (_, index) => 
                      properties[`balloonImage${index}`] || null
                    )}
                  />
                </div>
              );

            case 'beautiful-text':
              return (
                <div
                  key={element.id}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <BeautifulText
                    title={properties.title || 'Happy Birthday!'}
                    message={properties.message || 'Wishing you a wonderful day!'}
                    titleFont={properties.titleFont || 'playfair'}
                    messageFont={properties.messageFont || 'inter'}
                    titleColor={properties.titleColor || '#FF6B9D'}
                    messageColor={properties.messageColor || '#4A5568'}
                    titleSize={properties.titleSize || 48}
                    messageSize={properties.messageSize || 18}
                    alignment={properties.alignment || 'center'}
                    animation={properties.animation || 'fade-in'}
                    shadow={properties.shadow !== false}
                    gradient={properties.gradient || false}
                    padding={properties.padding || 20}
                  />
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-[1400px] mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">W</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            WishLuu
          </span>
        </Link>
        <Link 
          href="/wishes"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
        >
          Create Wish
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {!showMessage ? (
          /* Initial View */
          <div className="text-center">
            <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8">
              <div className="text-8xl mb-6">🎁</div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                You have a special wish!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Someone has created a beautiful, interactive wish just for you.
              </p>
              <button
                onClick={handleOpenWish}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-full text-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Open My Wish ✨
              </button>
            </div>
            
            <div className="text-center text-gray-500">
              <p>Made with ❤️ using WishLuu</p>
            </div>
          </div>
        ) : (
          /* Wish Display */
          <div className="relative">
            {/* Confetti Effect */}
            {showConfetti && (
              <div className="fixed inset-0 pointer-events-none z-50">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                  >
                    {['🎉', '✨', '💖', '🎊', '🌟'][Math.floor(Math.random() * 5)]}
                  </div>
                ))}
              </div>
            )}

            {/* Custom Elements or Default Layout */}
            {wish.elements && wish.elements.length > 0 ? (
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {renderCustomElements()}
              </div>
            ) : (
              <div className={`bg-gradient-to-br ${themeGradient} rounded-3xl shadow-2xl p-12 text-white text-center`}>
                <div className="text-8xl mb-6 animate-bounce">
                  {occasionData.emoji}
                </div>
                
                <h1 className="text-5xl font-bold mb-6">
                  Happy {occasionData.label}!
                </h1>
                
                {wish.recipientName && (
                  <p className="text-2xl mb-8">
                    Dear {wish.recipientName},
                  </p>
                )}
                
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8">
                  <p className="text-xl leading-relaxed whitespace-pre-line">
                    {wish.message}
                  </p>
                </div>
                
                {wish.senderName && (
                  <div className="text-xl">
                    <p>With love,</p>
                    <p className="font-semibold">{wish.senderName}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setShowMessage(false)}
                className="px-6 py-3 border-2 border-purple-500 text-purple-600 bg-white rounded-full hover:bg-purple-50 transition-colors"
              >
                View Again
              </button>
              <Link
                href="/templates"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300"
              >
                Create Your Own
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 