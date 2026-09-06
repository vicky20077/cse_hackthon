import { GeminiProvider } from './gemini';
import { OpenAIProvider } from './openai';
import { MockAIEngine } from './mock-engine';
import { ExperienceLevel, InterviewType, InterviewQuestion, AnswerEvaluation, InterviewReport } from '@/types/interview';

export type AIProviderName = 'gemini' | 'openai' | 'demo';

export class AIService {
  private gemini: GeminiProvider;
  private openai: OpenAIProvider;

  constructor() {
    this.gemini = new GeminiProvider();
    this.openai = new OpenAIProvider();
  }

  getActiveProviderName(): AIProviderName {
    if (this.gemini.isConfigured()) return 'gemini';
    if (this.openai.isConfigured()) return 'openai';
    return 'demo';
  }

  async generateNextQuestion(
    role: string,
    level: ExperienceLevel,
    interviewType: InterviewType,
    previousQuestions: InterviewQuestion[],
    questionNumber: number,
    totalQuestions: number,
    resumeSkills: string[] = []
  ): Promise<InterviewQuestion> {
    // If first question
    if (previousQuestions.length === 0) {
      if (this.gemini.isConfigured()) {
        try {
          const res = await this.gemini.generateQuestion(role, level, interviewType, [], resumeSkills);
          return {
            id: `q_${Date.now()}_1`,
            interviewId: '',
            questionNumber: 1,
            question: res.question,
            interviewerReaction: res.interviewerReaction || `Welcome to your ${role} interview! Let's get started.`,
            questionType: res.questionType,
            difficulty: res.difficulty,
            category: role,
          };
        } catch (e) {
          console.warn('Gemini generateQuestion error, falling back:', e);
        }
      }
      if (this.openai.isConfigured()) {
        try {
          const res = await this.openai.generateQuestion(role, level, interviewType, [], resumeSkills);
          return {
            id: `q_${Date.now()}_1`,
            interviewId: '',
            questionNumber: 1,
            question: res.question,
            interviewerReaction: res.interviewerReaction || `Welcome to your ${role} interview! Let's get started.`,
            questionType: res.questionType,
            difficulty: res.difficulty,
            category: role,
          };
        } catch (e) {
          console.warn('OpenAI generateQuestion error, falling back to mock:', e);
        }
      }
      return MockAIEngine.generateFirstQuestion(role, level, interviewType, resumeSkills);
    }

    // Dynamic follow-up
    const lastQuestion = previousQuestions[previousQuestions.length - 1];
    const lastAnswer = lastQuestion.userAnswer || '';

    if (this.gemini.isConfigured()) {
      try {
        const res = await this.gemini.generateQuestion(role, level, interviewType, previousQuestions, resumeSkills);
        return {
          id: `q_${Date.now()}_${questionNumber}`,
          interviewId: lastQuestion.interviewId,
          questionNumber,
          question: res.question,
          interviewerReaction: res.interviewerReaction || 'Good explanation. Let us move to the next question.',
          questionType: res.questionType,
          difficulty: res.difficulty,
          category: role,
        };
      } catch (e) {
        console.warn('Gemini error on follow-up, using Mock Engine:', e);
      }
    }

    if (this.openai.isConfigured()) {
      try {
        const res = await this.openai.generateQuestion(role, level, interviewType, previousQuestions, resumeSkills);
        return {
          id: `q_${Date.now()}_${questionNumber}`,
          interviewId: lastQuestion.interviewId,
          questionNumber,
          question: res.question,
          interviewerReaction: res.interviewerReaction || 'Thank you for your answer. Let us proceed.',
          questionType: res.questionType,
          difficulty: res.difficulty,
          category: role,
        };
      } catch (e) {
        console.warn('OpenAI error on follow-up, using Mock Engine:', e);
      }
    }

    // Default to Mock Engine
    return MockAIEngine.generateFollowUpQuestion(
      role,
      level,
      interviewType,
      lastQuestion,
      lastAnswer,
      questionNumber,
      totalQuestions
    );
  }

  async evaluateAndGenerateNext(
    role: string,
    level: ExperienceLevel,
    interviewType: InterviewType,
    currentQuestion: InterviewQuestion,
    answer: string,
    previousQuestions: InterviewQuestion[],
    nextQuestionNumber: number,
    totalQuestions: number
  ): Promise<{
    evaluation: AnswerEvaluation;
    nextQuestion: InterviewQuestion;
  }> {
    if (this.gemini.isConfigured()) {
      try {
        const res = await this.gemini.evaluateAndGenerateNext(
          role,
          level,
          interviewType,
          currentQuestion,
          answer,
          previousQuestions,
          nextQuestionNumber,
          totalQuestions
        );
        return {
          evaluation: res.evaluation,
          nextQuestion: {
            id: `q_${Date.now()}_${nextQuestionNumber}`,
            interviewId: currentQuestion.interviewId,
            questionNumber: nextQuestionNumber,
            question: res.nextQuestion.question,
            interviewerReaction: res.nextQuestion.interviewerReaction,
            questionType: res.nextQuestion.questionType,
            difficulty: res.nextQuestion.difficulty,
            category: role,
          },
        };
      } catch (e) {
        console.warn('Gemini evaluateAndGenerateNext failed/timed out, fast fallback to local engine:', e);
      }
    }

    // Instant local engine fallback (< 5ms)
    const evaluation = MockAIEngine.evaluateAnswer(currentQuestion, answer);
    const nextQuestion = MockAIEngine.generateFollowUpQuestion(
      role,
      level,
      interviewType,
      currentQuestion,
      answer,
      nextQuestionNumber,
      totalQuestions
    );

    return {
      evaluation,
      nextQuestion,
    };
  }

  async evaluateAnswer(question: InterviewQuestion, answer: string): Promise<AnswerEvaluation> {
    if (this.gemini.isConfigured()) {
      try {
        return await this.gemini.evaluateAnswer(question, answer);
      } catch (e) {
        console.warn('Gemini evaluate error, falling back to Mock:', e);
      }
    }
    if (this.openai.isConfigured()) {
      try {
        return await this.openai.evaluateAnswer(question, answer);
      } catch (e) {
        console.warn('OpenAI evaluate error, falling back to Mock:', e);
      }
    }
    return MockAIEngine.evaluateAnswer(question, answer);
  }

  async generateReport(session: { role: string; level: ExperienceLevel; questions: InterviewQuestion[] }): Promise<InterviewReport> {
    if (this.gemini.isConfigured()) {
      try {
        return await this.gemini.generateFinalReport(session);
      } catch (e) {
        console.warn('Gemini report error, falling back to Mock:', e);
      }
    }
    if (this.openai.isConfigured()) {
      try {
        return await this.openai.generateFinalReport(session);
      } catch (e) {
        console.warn('OpenAI report error, falling back to Mock:', e);
      }
    }
    return MockAIEngine.generateReport(session);
  }
}

export const aiService = new AIService();
