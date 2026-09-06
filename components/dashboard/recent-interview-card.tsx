'use client';

import * as React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ChevronRight, Award, Mic } from 'lucide-react';
import { InterviewSession } from '@/types/interview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, getScoreColor } from '@/lib/utils/formatters';

interface RecentInterviewCardProps {
  interview: InterviewSession;
}

export function RecentInterviewCard({ interview }: RecentInterviewCardProps) {
  const score = interview.overallScore || interview.report?.overallScore || 8.0;
  const scoreStyle = getScoreColor(score);

  return (
    <div className="rounded-2xl bg-surface border border-white/5 p-5 shadow-xl transition-all duration-300 hover:border-primary/40 hover:shadow-primary/5 group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left info */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
              {interview.role}
            </span>
            <Badge variant="outline">{interview.level}</Badge>
            <Badge variant="purple">{interview.interviewType}</Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(interview.startedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {interview.durationMinutes} mins
            </span>
            <span className="flex items-center gap-1">
              <Mic className="h-3.5 w-3.5" />
              {interview.questions.length} questions
            </span>
          </div>
        </div>

        {/* Right score & action */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Score</span>
            <span className={`text-lg font-black ${scoreStyle.text}`}>
              {score.toFixed(1)} <span className="text-xs text-muted-foreground font-normal">/ 10</span>
            </span>
          </div>

          <Link href={`/history/${interview.id}`}>
            <Button variant="secondary" size="sm" className="group-hover:bg-primary group-hover:text-white transition-all">
              <span>Review</span>
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
