'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mic,
  Award,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScoreRing } from '@/components/ui/score-ring';
import { QuestionReviewCard } from '@/components/interview/question-review-card';
import { getSessionById, getStoredSessions } from '@/lib/store/interview-store';
import { InterviewSession } from '@/types/interview';
import { formatDate } from '@/lib/utils/formatters';

export default function HistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [session, setSession] = React.useState<InterviewSession | null>(null);

  React.useEffect(() => {
    const found = getSessionById(id) || getStoredSessions().find((s) => s.id === id) || null;
    setSession(found);
  }, [id]);

  if (!session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
        <h3 className="text-base font-bold text-white">Interview Not Found</h3>
        <Link href="/history">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to History
          </Button>
        </Link>
      </div>
    );
  }

  const report = session.report || {
    id: 'rep-fallback',
    interviewId: session.id,
    overallScore: session.overallScore || 8.4,
    technicalScore: 8.6,
    communicationScore: 8.2,
    confidenceScore: 8.4,
    problemSolvingScore: 8.5,
    relevanceScore: 8.9,
    strengths: [
      'Clear explanation of system requirements and performance tuning.',
      'Disciplined structuring with relevant examples.',
    ],
    weaknesses: [
      'Could expand on distributed failover and edge case handling.',
    ],
    recommendations: [
      'Advanced Distributed Systems & Message Queues',
      'Database Index Optimization with EXPLAIN ANALYZE',
    ],
    summary: 'Candidate showed strong readiness with clear technical concepts.',
    createdAt: session.startedAt,
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#070711]">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto w-full">
        {/* Top return link */}
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <Link href="/history">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Back to All Interviews</span>
            </Button>
          </Link>

          <Badge variant="success">Completed Review</Badge>
        </div>

        {/* Header Summary */}
        <div className="rounded-3xl bg-surface border border-white/10 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{session.role}</h1>
              <Badge variant="outline">{session.level}</Badge>
              <Badge variant="purple">{session.interviewType}</Badge>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(session.startedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {session.durationMinutes} min session
              </span>
              <span className="flex items-center gap-1">
                <Mic className="h-3.5 w-3.5" />
                {session.questions.length} questions
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <ScoreRing score={report.overallScore} size={130} strokeWidth={10} label="Final Score" />
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-surface border border-emerald-500/20 p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Strengths Highlighted</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-foreground/80">
              {report.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-surface border border-amber-500/20 p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
              <AlertCircle className="h-4 w-4" />
              <span>Areas for Improvement</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-foreground/80">
              {report.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Question-By-Question List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Question Transcripts & Evaluations</h3>
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
