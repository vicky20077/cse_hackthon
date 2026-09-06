export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  college?: string;
  degree?: string;
  graduationYear?: string;
  targetRole?: string;
  experienceLevel?: 'Internship' | 'Fresher' | 'Experienced';
  preferredInterviewType?: 'Technical' | 'HR / Behavioral' | 'Mixed' | 'Resume Based';
  skills: string[];
  bio?: string;
  createdAt: string;
}

export interface UserStats {
  interviewsCompleted: number;
  averageScore: number;
  bestScore: number;
  currentStreak: number;
  totalTimeMinutes: number;
  skillBreakdown: {
    technicalKnowledge: number;
    communication: number;
    confidence: number;
    problemSolving: number;
    relevance: number;
  };
  scoreHistory: {
    id: string;
    date: string;
    score: number;
    role: string;
  }[];
}
