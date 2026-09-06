import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai/ai-provider';
import { ExperienceLevel, InterviewType, InterviewQuestion } from '@/types/interview';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      role,
      level,
      interviewType,
      previousQuestions,
      questionNumber,
      totalQuestions,
      resumeSkills,
    } = body;

    const nextQuestion = await aiService.generateNextQuestion(
      role || 'Full Stack Developer',
      (level as ExperienceLevel) || 'Fresher',
      (interviewType as InterviewType) || 'Technical',
      (previousQuestions as InterviewQuestion[]) || [],
      questionNumber || 2,
      totalQuestions || 5,
      resumeSkills || []
    );

    return NextResponse.json({
      success: true,
      question: nextQuestion,
      provider: aiService.getActiveProviderName(),
    });
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate next question' },
      { status: 500 }
    );
  }
}
