import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai/ai-provider';
import { ExperienceLevel, InterviewType, InterviewSession } from '@/types/interview';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, customRole, level, interviewType, durationMinutes, voiceGender, resumeSkills } = body;

    const chosenRole = (customRole && customRole.trim()) || role || 'Full Stack Developer';
    const chosenLevel = (level as ExperienceLevel) || 'Fresher';
    const chosenType = (interviewType as InterviewType) || 'Technical';
    const duration = durationMinutes || 10;
    const gender = voiceGender || 'female';

    const firstQuestion = await aiService.generateNextQuestion(
      chosenRole,
      chosenLevel,
      chosenType,
      [],
      1,
      Math.max(3, Math.round(duration / 2)),
      resumeSkills || []
    );

    const session: InterviewSession = {
      id: `session_${Date.now()}`,
      userId: 'demo-user-123',
      role: chosenRole,
      customRole,
      level: chosenLevel,
      interviewType: chosenType,
      durationMinutes: duration,
      voiceGender: gender,
      questions: [{ ...firstQuestion, interviewId: `session_${Date.now()}` }],
      currentQuestionIndex: 0,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      session,
      provider: aiService.getActiveProviderName(),
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize interview. Falling back to default session.',
      },
      { status: 500 }
    );
  }
}
