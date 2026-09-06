-- ============================================================
-- InterviewAI Supabase PostgreSQL Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  college TEXT,
  degree TEXT,
  graduation_year TEXT,
  target_role TEXT DEFAULT 'Full Stack Developer',
  experience_level TEXT DEFAULT 'Fresher',
  preferred_interview_type TEXT DEFAULT 'Technical',
  skills TEXT[] DEFAULT '{}',
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RESUMES TABLE
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  parsed_text TEXT,
  skills TEXT[] DEFAULT '{}',
  projects JSONB DEFAULT '[]'::jsonb,
  experience JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  certifications TEXT[] DEFAULT '{}',
  use_for_interviews BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. INTERVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  custom_role TEXT,
  level TEXT NOT NULL CHECK (level IN ('Internship', 'Fresher', 'Experienced')),
  interview_type TEXT NOT NULL CHECK (interview_type IN ('Technical', 'HR / Behavioral', 'Mixed', 'Resume Based')),
  duration_minutes INTEGER NOT NULL DEFAULT 10,
  voice_gender TEXT DEFAULT 'male' CHECK (voice_gender IN ('male', 'female')),
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  overall_score NUMERIC(3, 1),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question TEXT NOT NULL,
  question_type TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category TEXT,
  target_concepts TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ANSWERS TABLE
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  answer_text TEXT,
  transcript TEXT,
  technical_score NUMERIC(3, 1),
  communication_score NUMERIC(3, 1),
  relevance_score NUMERIC(3, 1),
  depth_score NUMERIC(3, 1),
  confidence_score NUMERIC(3, 1),
  problem_solving_score NUMERIC(3, 1),
  what_was_good TEXT[] DEFAULT '{}',
  what_could_improve TEXT[] DEFAULT '{}',
  ideal_answer_structure TEXT,
  star_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. INTERVIEW_REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.interview_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID UNIQUE NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  overall_score NUMERIC(3, 1) NOT NULL,
  technical_score NUMERIC(3, 1) NOT NULL,
  communication_score NUMERIC(3, 1) NOT NULL,
  confidence_score NUMERIC(3, 1) NOT NULL,
  problem_solving_score NUMERIC(3, 1) NOT NULL,
  relevance_score NUMERIC(3, 1) NOT NULL,
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can select/update only their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Resumes: Users can manage own resumes
CREATE POLICY "Users can view own resumes" ON public.resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resumes" ON public.resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resumes" ON public.resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resumes" ON public.resumes FOR DELETE USING (auth.uid() = user_id);

-- Interviews: Users can view & create their own interviews
CREATE POLICY "Users can view own interviews" ON public.interviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interviews" ON public.interviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interviews" ON public.interviews FOR UPDATE USING (auth.uid() = user_id);

-- Questions & Answers: Linked through interview owner
CREATE POLICY "Users can view interview questions" ON public.questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.interviews WHERE interviews.id = questions.interview_id AND interviews.user_id = auth.uid())
);
CREATE POLICY "Users can view interview answers" ON public.answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.interviews WHERE interviews.id = answers.interview_id AND interviews.user_id = auth.uid())
);
CREATE POLICY "Users can view interview reports" ON public.interview_reports FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.interviews WHERE interviews.id = interview_reports.interview_id AND interviews.user_id = auth.uid())
);
