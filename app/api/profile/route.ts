import { NextRequest, NextResponse } from 'next/server';
import { DEMO_USER } from '@/lib/store/mock-data';

let currentProfile = { ...DEMO_USER };

export async function GET() {
  return NextResponse.json({
    success: true,
    profile: currentProfile,
  });
}

export async function PUT(req: NextRequest) {
  try {
    const updates = await req.json();
    currentProfile = {
      ...currentProfile,
      ...updates,
    };

    return NextResponse.json({
      success: true,
      profile: currentProfile,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
