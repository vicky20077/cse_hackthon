import { NextRequest, NextResponse } from 'next/server';
import { DEMO_INTERVIEW_HISTORY } from '@/lib/store/mock-data';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const interview = DEMO_INTERVIEW_HISTORY.find((item) => item.id === id);

  if (!interview) {
    return NextResponse.json(
      { success: false, error: 'Interview not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    interview,
  });
}
