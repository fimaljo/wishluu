import { NextRequest, NextResponse } from 'next/server';
import { Wish } from '@/types';

// Simple in-memory storage for demo purposes
// In a real app, this would be replaced with Firebase or a database
let wishStorage: Wish[] = [
  {
    id: 'wish_1703123456789',
    recipientName: 'Sarah',
    occasion: 'birthday',
    message: 'Happy Birthday, Sarah! 🎉\n\nOn this special day, I want you to know how much joy and happiness you bring to everyone around you. Your smile lights up every room you enter, and your kindness touches the hearts of all who know you.\n\nMay this year bring you countless moments of laughter, love, and beautiful memories. You deserve all the wonderful things life has to offer!\n\nWith love and warmest wishes,\nYour Secret Admirer 💕',
    theme: 'purple',
    animation: 'fade',
    createdAt: new Date().toISOString(),
    isPublic: true,
    views: 0,
    likes: 0,
    senderName: 'Your Secret Admirer',
    elements: [
      {
        id: 'balloons_1',
        elementType: 'balloons-interactive',
        properties: {
          numberOfBalloons: 8,
          balloonColors: ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#FF9FF3', '#54A0FF', '#5F27CD'],
          balloonSize: 70
        }
      },
      {
        id: 'text_1',
        elementType: 'beautiful-text',
        properties: {
          title: 'Happy Birthday, Sarah!',
          message: 'Wishing you a day filled with joy, love, and beautiful memories! 🎉',
          titleFont: 'playfair',
          messageFont: 'inter',
          titleColor: '#FF6B9D',
          messageColor: '#4A5568',
          titleSize: 56,
          messageSize: 20,
          alignment: 'center',
          animation: 'fade-in',
          shadow: true,
          gradient: true,
          padding: 30
        }
      }
    ]
  }
];

// Function to add a wish to storage
export function addWishToStorage(wish: Wish) {
  wishStorage.push(wish);
}

// GET /api/wishes/[id] - Get a specific wish by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const wish = wishStorage.find(w => w.id === id);

    if (!wish) {
      return NextResponse.json(
        { success: false, error: 'Wish not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: wish 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wish' },
      { status: 500 }
    );
  }
} 