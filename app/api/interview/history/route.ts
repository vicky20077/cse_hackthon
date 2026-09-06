import { NextResponse } from 'next/server';
import { DEMO_INTERVIEW_HISTORY } from '@/lib/store/mock-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    interviews: DEMO_INTERVIEW_HISTORY,
  });
}
