import { NextRequest, NextResponse } from 'next/server';
import { getWishById } from '@/lib/wishStorage';

// GET /api/wishes/[id] - Get a specific wish by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const wish = getWishById(id);

    if (!wish) {
      return NextResponse.json(
        { success: false, error: 'Wish not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: wish,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wish' },
      { status: 500 }
    );
  }
}
