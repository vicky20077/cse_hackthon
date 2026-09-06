import OpenAI from 'openai';
import { INTERVIEWER_SYSTEM_PROMPT, EVALUATION_SYSTEM_PROMPT, FINAL_REPORT_SYSTEM_PROMPT } from './prompts';
import { ExperienceLevel, InterviewType, InterviewQuestion, AnswerEvaluation, InterviewReport } from '@/types/interview';

export class OpenAIProvider {
  private client: OpenAI | null = null;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.OPENAI_API_KEY || '';
    if (key) {
      this.client = new OpenAI({ apiKey: key });
    }
  }

  isConfigured(): boolean {
    return Boolean(this.client);
  }

  async generateQuestion(
    role: string,
    level: ExperienceLevel,
    interviewType: InterviewType,
    previousQuestions: InterviewQuestion[],
    resumeSkills: string[] = []
  ): Promise<{
    question: string;
    interviewerReaction?: string;
    questionType: InterviewQuestion['questionType'];
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }> {
    if (!this.client) throw new Error('OpenAI API key not configured');

    const prompt = `
Candidate Context:
- Target Role: ${role}
- Experience Level: ${level}
- Interview Type: ${interviewType}
- Extracted Resume Skills: ${resumeSkills.join(', ') || 'None'}

Conversation History:
${previousQuestions.map((q, i) => `Question ${i + 1}: ${q.question}\nAnswer: ${q.userAnswer || 'No answer provided yet'}`).join('\n')}

Generate the next conversational interviewer reaction and the next interview question as JSON:
{
  "interviewerReaction": "Natural verbal reaction and feedback acknowledging the candidate's last answer",
  "question": "The next clear interview question",
  "questionType": "technical",
  "difficulty": "Medium"
}
`;

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: INTERVIEWER_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return {
      question: parsed.question || 'Could you walk me through your technical approach?',
      interviewerReaction: parsed.interviewerReaction || '',
      questionType: parsed.questionType || 'technical',
      difficulty: parsed.difficulty || 'Medium',
    };
  }

  async evaluateAnswer(question: InterviewQuestion, answer: string): Promise<AnswerEvaluation> {
    if (!this.client) throw new Error('OpenAI API key not configured');

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: EVALUATION_SYSTEM_PROMPT },
        { role: 'user', content: `Question: ${question.question}\nAnswer: ${answer}` },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  }

  async generateFinalReport(session: { role: string; level: ExperienceLevel; questions: InterviewQuestion[] }): Promise<InterviewReport> {
    if (!this.client) throw new Error('OpenAI API key not configured');

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: FINAL_REPORT_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Role: ${session.role}\nLevel: ${session.level}\nQuestions & Answers:\n${JSON.stringify(session.questions, null, 2)}`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return {
      id: `rep_${Date.now()}`,
      interviewId: session.questions[0]?.interviewId || 'session',
      ...parsed,
      createdAt: new Date().toISOString(),
    };
  }
}
