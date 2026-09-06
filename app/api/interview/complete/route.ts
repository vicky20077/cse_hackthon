import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai/ai-provider';
import { ExperienceLevel, InterviewQuestion } from '@/types/interview';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, level, questions } = body;

    const report = await aiService.generateReport({
      role: role || 'Full Stack Developer',
      level: (level as ExperienceLevel) || 'Fresher',
      questions: (questions as InterviewQuestion[]) || [],
    });

    return NextResponse.json({
      success: true,
      report,
      provider: aiService.getActiveProviderName(),
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate interview report' },
      { status: 500 }
    );
  }
}
