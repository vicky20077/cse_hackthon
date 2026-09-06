import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai/ai-provider';
import { InterviewQuestion } from '@/types/interview';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      question,
      answer,
      role,
      level,
      interviewType,
      previousQuestions,
      nextQuestionNumber,
      totalQuestions,
    } = body;

    if (!question || typeof answer !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing question or answer payload' },
        { status: 400 }
      );
    }

    // Fast combined evaluation + next question generation
    if (role && nextQuestionNumber) {
      const result = await aiService.evaluateAndGenerateNext(
        role,
        level || 'Fresher',
        interviewType || 'Technical',
        question as InterviewQuestion,
        answer,
        previousQuestions || [],
        nextQuestionNumber,
        totalQuestions || 5
      );

      return NextResponse.json({
        success: true,
        evaluation: result.evaluation,
        nextQuestion: result.nextQuestion,
        provider: aiService.getActiveProviderName(),
      });
    }

    const evaluation = await aiService.evaluateAnswer(question as InterviewQuestion, answer);

    return NextResponse.json({
      success: true,
      evaluation,
      provider: aiService.getActiveProviderName(),
    });
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to evaluate answer' },
      { status: 500 }
    );
  }
}
