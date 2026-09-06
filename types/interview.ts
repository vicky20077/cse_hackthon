export type ExperienceLevel = 'Internship' | 'Fresher' | 'Experienced';

export type InterviewType = 'Technical' | 'HR / Behavioral' | 'Mixed' | 'Resume Based';

export type QuestionType = 'technical' | 'behavioral' | 'followup' | 'situational' | 'system_design' | 'general';

export interface StarAnalysis {
  situation: { present: boolean; feedback: string };
  task: { present: boolean; feedback: string };
  action: { present: boolean; feedback: string };
  result: { present: boolean; feedback: string };
  overallStarScore: number; // 0-10
  advice: string;
}

export interface AnswerEvaluation {
  technicalScore: number;     // 0-10
  communicationScore: number; // 0-10
  relevanceScore: number;     // 0-10
  depthScore: number;         // 0-10
  confidenceScore: number;    // 0-10
  problemSolvingScore: number;// 0-10
  whatWasGood: string[];
  whatCouldImprove: string[];
  idealAnswerStructure: string;
  keyConceptsMentioned: string[];
  starAnalysis?: StarAnalysis;
  suggestedFollowUp?: string;
}

export interface InterviewQuestion {
  id: string;
  interviewId: string;
  questionNumber: number;
  question: string;
  interviewerReaction?: string;
  questionType: QuestionType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  targetConcepts?: string[];
  userAnswer?: string;
  userAudioTranscript?: string;
  evaluation?: AnswerEvaluation;
  answeredAt?: string;
  durationSeconds?: number;
}

export interface InterviewReport {
  id: string;
  interviewId: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  problemSolvingScore: number;
  relevanceScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  summary: string;
  createdAt: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  role: string;
  customRole?: string;
  level: ExperienceLevel;
  interviewType: InterviewType;
  durationMinutes: number;
  voiceGender: 'male' | 'female';
  resumeId?: string;
  resumeFileName?: string;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  overallScore?: number;
  startedAt: string;
  completedAt?: string;
  report?: InterviewReport;
}

export interface RolePreset {
  id: string;
  title: string;
  category: 'Engineering' | 'Data & AI' | 'Design & Product' | 'Security & Ops';
  iconName: string;
  description: string;
  keySkills: string[];
  popularCompanies: string[];
}
