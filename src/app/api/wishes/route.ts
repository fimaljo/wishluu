import { NextRequest, NextResponse } from 'next/server';
import { Wish } from '@/types';
import { addWishToStorage, getAllWishes } from '@/lib/wishStorage';

// GET /api/wishes - Get all wishes
export async function GET() {
  try {
    const wishes = getAllWishes();

    return NextResponse.json({
      success: true,
      data: wishes,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishes' },
      { status: 500 }
    );
  }
}

// POST /api/wishes - Create a new wish
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.recipientName || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual Firebase call
    const newWish: Wish = {
      id: `wish_${Date.now()}`,
      recipientName: body.recipientName,
      occasion: body.occasion || 'birthday',
      message: body.message,
      theme: body.theme || 'purple',
      animation: body.animation || 'fade',
      createdAt: new Date().toISOString(),
      isPublic: body.isPublic ?? true,
      views: 0,
      likes: 0,
      ...(body.senderName && { senderName: body.senderName }),
      ...(body.senderEmail && { senderEmail: body.senderEmail }),
      ...(body.elements && { elements: body.elements }),
      ...(body.customBackgroundColor && {
        customBackgroundColor: body.customBackgroundColor,
      }),
    };

    // Add to storage so it can be retrieved later
    addWishToStorage(newWish);

    return NextResponse.json(
      {
        success: true,
        data: newWish,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create wish' },
      { status: 500 }
    );
  }
}
