import { GoogleGenerativeAI } from '@google/generative-ai';
import { INTERVIEWER_SYSTEM_PROMPT, EVALUATION_SYSTEM_PROMPT, FINAL_REPORT_SYSTEM_PROMPT } from './prompts';
import { ExperienceLevel, InterviewType, InterviewQuestion, AnswerEvaluation, InterviewReport } from '@/types/interview';

async function withTimeout<T>(promise: Promise<T>, ms = 3800): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Gemini request timed out after ${ms}ms`)), ms);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
}

export class GeminiProvider {
  private apiKey: string;
  private genAI: GoogleGenerativeAI | null = null;
  private readonly preferredModel = 'gemini-2.0-flash';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
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
    nextQuestion: {
      question: string;
      interviewerReaction: string;
      questionType: InterviewQuestion['questionType'];
      difficulty: 'Easy' | 'Medium' | 'Hard';
    };
  }> {
    if (!this.genAI) throw new Error('Gemini API key not configured');

    const model = this.genAI.getGenerativeModel({ model: this.preferredModel });
    const prompt = `
You are an expert technical interviewer and evaluator.
Target Role: ${role} (${level}, ${interviewType})
Active Question: "${currentQuestion.question}"
Candidate Answer: "${answer}"

Previous Turn History:
${previousQuestions.slice(-3).map((q, i) => `Q: ${q.question} | Ans: ${q.userAnswer || 'N/A'}`).join('\n')}

Perform two tasks in a SINGLE fast structured JSON response:
1. "evaluation": Evaluate the candidate's answer thoroughly and constructively.
2. "nextQuestion": Generate the next conversational interviewer feedback response ("interviewerReaction") acknowledging what they just said, followed by the next targeted interview question (#${nextQuestionNumber} of ${totalQuestions}).

Return strictly valid JSON:
{
  "evaluation": {
    "technicalScore": number (0-10),
    "communicationScore": number (0-10),
    "relevanceScore": number (0-10),
    "depthScore": number (0-10),
    "confidenceScore": number (0-10),
    "problemSolvingScore": number (0-10),
    "whatWasGood": ["string"],
    "whatCouldImprove": ["string"],
    "idealAnswerStructure": "string",
    "keyConceptsMentioned": ["string"]
  },
  "nextQuestion": {
    "interviewerReaction": "Natural conversational feedback acknowledging specific details in their answer",
    "question": "The next concise interview question to ask",
    "questionType": "technical",
    "difficulty": "Medium"
  }
}
`;

    const apiCall = model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await withTimeout(apiCall, 4200);
    const text = result.response.text();
    return JSON.parse(text);
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
    if (!this.genAI) throw new Error('Gemini API key not configured');

    const model = this.genAI.getGenerativeModel({ model: this.preferredModel });
    const prompt = `
${INTERVIEWER_SYSTEM_PROMPT}

Candidate Context:
- Target Role: ${role}
- Experience Level: ${level}
- Interview Type: ${interviewType}
- Extracted Resume Skills: ${resumeSkills.join(', ') || 'None provided'}

Conversation History so far:
${previousQuestions
  .map(
    (q, i) =>
      `Question ${i + 1}: ${q.question}\nCandidate Answer: ${q.userAnswer || 'No answer provided yet'}\n`
  )
  .join('\n')}

Generate the next conversational interviewer response and the next interview question.
1. "interviewerReaction": A natural, professional response acknowledging and giving brief constructive interviewer feedback on what the candidate just answered in their last turn. If this is the first question, give a warm, energetic welcome.
2. "question": The next clear, targeted question to ask.
3. "questionType": "technical" | "behavioral" | "followup" | "system_design"
4. "difficulty": "Easy" | "Medium" | "Hard"

Return strictly valid JSON:
{
  "interviewerReaction": "Your direct response/reaction to their previous answer",
  "question": "The next question text",
  "questionType": "technical",
  "difficulty": "Medium"
}
`;

    const apiCall = model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await withTimeout(apiCall, 3800);
    const text = result.response.text();
    try {
      const parsed = JSON.parse(text);
      return {
        question: parsed.question || 'Could you elaborate further on that?',
        interviewerReaction: parsed.interviewerReaction || '',
        questionType: parsed.questionType || 'technical',
        difficulty: parsed.difficulty || 'Medium',
      };
    } catch {
      return {
        question: text.replace(/[{}[\]"]/g, '').trim(),
        interviewerReaction: 'Thank you for sharing those details.',
        questionType: 'technical',
        difficulty: 'Medium',
      };
    }
  }

  async evaluateAnswer(
    question: InterviewQuestion,
    answer: string
  ): Promise<AnswerEvaluation> {
    if (!this.genAI) throw new Error('Gemini API key not configured');

    const model = this.genAI.getGenerativeModel({ model: this.preferredModel });
    const prompt = `
${EVALUATION_SYSTEM_PROMPT}

Question: "${question.question}"
Question Type: ${question.questionType}
Candidate Answer: "${answer}"

Analyze the candidate's answer carefully. Return the evaluation JSON.
`;

    const apiCall = model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await withTimeout(apiCall, 3800);
    const text = result.response.text();
    return JSON.parse(text);
  }

  async generateFinalReport(session: {
    role: string;
    level: ExperienceLevel;
    questions: InterviewQuestion[];
  }): Promise<InterviewReport> {
    if (!this.genAI) throw new Error('Gemini API key not configured');

    const model = this.genAI.getGenerativeModel({ model: this.preferredModel });
    const prompt = `
${FINAL_REPORT_SYSTEM_PROMPT}

Role: ${session.role}
Level: ${session.level}

Questions & Candidate Responses:
${session.questions
  .map(
    (q, i) =>
      `Question ${i + 1} (${q.category}): ${q.question}\nAnswer: ${q.userAnswer}\nEvaluation Score: ${q.evaluation?.technicalScore || 'N/A'}`
  )
  .join('\n\n')}

Generate the final synthesis report JSON.
`;

    const apiCall = model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await withTimeout(apiCall, 5000);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return {
      id: `rep_${Date.now()}`,
      interviewId: session.questions[0]?.interviewId || 'session',
      ...parsed,
      createdAt: new Date().toISOString(),
    };
  }
}
