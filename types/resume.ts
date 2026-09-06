export interface ExtractedProject {
  title: string;
  description: string;
  technologies: string[];
}

export interface ExtractedExperience {
  role: string;
  company: string;
  duration?: string;
  highlights: string[];
}

export interface ExtractedEducation {
  institution: string;
  degree: string;
  year?: string;
}

export interface ParsedResume {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  parsedText: string;
  skills: string[];
  projects: ExtractedProject[];
  experience: ExtractedExperience[];
  education: ExtractedEducation[];
  certifications: string[];
  useForInterviews: boolean;
}
