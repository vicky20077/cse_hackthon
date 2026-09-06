'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Share2,
  Download,
  Flame,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { ScoreRing } from '@/components/ui/score-ring';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuestionReviewCard } from '@/components/interview/question-review-card';
import { getSessionById, getStoredSessions } from '@/lib/store/interview-store';
import { InterviewSession } from '@/types/interview';
import { useToast } from '@/components/ui/toast';

export default function InterviewResultsPage() {
  const params = useParams();
  const interviewId = params.id as string;
  const { toast } = useToast();

  const [session, setSession] = React.useState<InterviewSession | null>(null);

  React.useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C5CFC', '#3B82F6', '#22C55E', '#F59E0B'],
      });
    } catch {}

    const found = getSessionById(interviewId) || getStoredSessions()[0] || null;
    setSession(found);
  }, [interviewId]);

  if (!session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        <p className="text-xs text-muted-foreground">Synthesizing interview results...</p>
      </div>
    );
  }

  const report = session.report || {
    id: 'rep-fallback',
    interviewId: session.id,
    overallScore: session.overallScore || 8.4,
    technicalScore: 8.7,
    communicationScore: 7.9,
    confidenceScore: 8.2,
    problemSolvingScore: 8.5,
    relevanceScore: 9.0,
    strengths: [
      'You explained your project architecture clearly and demonstrated good understanding of REST APIs.',
      'Effectively articulated caching and database indexing trade-offs.',
      'Maintained professional composure and answered with confidence.',
    ],
    weaknesses: [
      'Your answers could be more structured. Try explaining the problem, your approach, and the result separately.',
      'Include quantitative metrics whenever describing past performance optimizations.',
    ],
    recommendations: [
      'REST API Design & Idempotency',
      'MongoDB vs PostgreSQL Indexing Strategies',
      'OAuth 2.0 PKCE & Secure Token Rotation',
      'Distributed Systems & Cache Invalidation',
    ],
    summary: 'Strong overall performance demonstrating solid domain competence and structured problem solving.',
    createdAt: new Date().toISOString(),
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        type: 'success',
        title: 'Report Link Copied!',
        description: 'Share your mock interview achievement with mentors or recruiters.',
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#070711]">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto w-full">
        {/* 1. CELEBRATION HEADER & OVERALL SCORE */}
        <div className="rounded-3xl bg-gradient-to-b from-[#141428] to-[#0d0d1b] border border-primary/30 p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Interview Complete 🎉</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Performance Evaluation Report
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Role: <span className="text-white font-semibold">{session.role}</span> • {session.level} • {session.interviewType}
            </p>
          </div>

          {/* Center Circular Score Gauge */}
          <div className="flex flex-col items-center justify-center py-2">
            <ScoreRing score={report.overallScore} size={160} strokeWidth={12} label="Overall Score" />
          </div>

          {/* 5-Dimensional Metrics Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-white/5">
            <div className="rounded-2xl bg-black/40 border border-white/5 p-3.5">
              <span className="text-[11px] text-muted-foreground uppercase font-bold">Technical</span>
              <p className="text-xl font-black text-emerald-400 mt-1">
                {report.technicalScore.toFixed(1)} <span className="text-xs text-muted-foreground font-normal">/10</span>
              </p>
            </div>
            <div className="rounded-2xl bg-black/40 border border-white/5 p-3.5">
              <span className="text-[11px] text-muted-foreground uppercase font-bold">Communication</span>
              <p className="text-xl font-black text-primary mt-1">
                {report.communicationScore.toFixed(1)} <span className="text-xs text-muted-foreground font-normal">/10</span>
              </p>
            </div>
            <div className="rounded-2xl bg-black/40 border border-white/5 p-3.5">
              <span className="text-[11px] text-muted-foreground uppercase font-bold">Confidence</span>
              <p className="text-xl font-black text-secondary mt-1">
                {report.confidenceScore.toFixed(1)} <span className="text-xs text-muted-foreground font-normal">/10</span>
              </p>
            </div>
            <div className="rounded-2xl bg-black/40 border border-white/5 p-3.5">
              <span className="text-[11px] text-muted-foreground uppercase font-bold">Problem Solving</span>
              <p className="text-xl font-black text-purple-400 mt-1">
                {report.problemSolvingScore.toFixed(1)} <span className="text-xs text-muted-foreground font-normal">/10</span>
              </p>
            </div>
            <div className="rounded-2xl bg-black/40 border border-white/5 p-3.5 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-muted-foreground uppercase font-bold">Relevance</span>
              <p className="text-xl font-black text-amber-400 mt-1">
                {report.relevanceScore.toFixed(1)} <span className="text-xs text-muted-foreground font-normal">/10</span>
              </p>
            </div>
          </div>

          {/* Quick Action bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/interview/setup">
              <Button variant="glow" size="md">
                <RotateCcw className="h-4 w-4 mr-1.5" />
                <span>Practice Another Interview</span>
              </Button>
            </Link>
            <Button variant="secondary" size="md" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1.5" />
              <span>Share Score</span>
            </Button>
          </div>
        </div>

        {/* 2. AI COACH FEEDBACK: STRENGTHS & WEAKNESSES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What You Did Well */}
          <div className="rounded-3xl bg-surface border border-emerald-500/20 p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <div className="p-2 rounded-xl bg-emerald-500/15">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">What You Did Well</h3>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/90 leading-relaxed">
              {report.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What You Should Improve */}
          <div className="rounded-3xl bg-surface border border-amber-500/20 p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2.5 text-amber-400">
              <div className="p-2 rounded-xl bg-amber-500/15">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">What You Should Improve</h3>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/90 leading-relaxed">
              {report.weaknesses.map((weak, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold shrink-0 mt-0.5">!</span>
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. RECOMMENDED PRACTICE TOPICS */}
        <div className="rounded-3xl bg-surface border border-white/10 p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-white">Recommended Practice Topics</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Curated study subjects to address detected improvement areas before your next real interview.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {report.recommendations.map((topic, i) => (
              <div
                key={i}
                className="rounded-2xl bg-black/40 border border-white/5 p-4 space-y-2 hover:border-primary/40 transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-primary">Topic 0{i + 1}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                  {topic}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* 4. QUESTION-BY-QUESTION REVIEW */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Question-By-Question Detailed Review ({session.questions.length})
            </h3>
            <span className="text-xs text-muted-foreground">Click cards to expand details</span>
          </div>

          <div className="space-y-4">
            {session.questions.map((q, idx) => (
              <QuestionReviewCard key={q.id || idx} question={q} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
