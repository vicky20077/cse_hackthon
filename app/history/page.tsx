'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  History,
  Search,
  Calendar,
  Clock,
  ChevronRight,
  Filter,
  Mic,
  Award,
  ArrowRight,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getStoredSessions } from '@/lib/store/interview-store';
import { InterviewSession } from '@/types/interview';
import { formatDate, getScoreColor } from '@/lib/utils/formatters';

export default function HistoryPage() {
  const [sessions, setSessions] = React.useState<InterviewSession[]>([]);
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('All');
  const [timeFilter, setTimeFilter] = React.useState<'7' | '30' | '90' | 'all'>('all');

  React.useEffect(() => {
    setSessions(getStoredSessions());
  }, []);

  const filtered = sessions.filter((s) => {
    const matchesSearch =
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.interviewType.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || s.interviewType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#070711]">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <History className="h-7 w-7 text-primary" />
              Interview History
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Review and learn from your previous AI mock interview performances.
            </p>
          </div>

          <Link href="/interview/setup">
            <Button variant="glow" size="sm">
              <Mic className="h-4 w-4 mr-1.5" />
              Start New Interview
            </Button>
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by role or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-white/10 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {/* Time range pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {(['7', '30', '90', 'all'] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setTimeFilter(period)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  timeFilter === period
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-surface text-muted-foreground hover:text-white border border-white/5'
                }`}
              >
                {period === 'all' ? 'All Time' : `${period} Days`}
              </button>
            ))}
          </div>
        </div>

        {/* Interviews Table / Cards */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-surface border border-white/5 p-12 text-center space-y-4">
            <History className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="text-base font-bold text-white">No interviews found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You haven&apos;t completed any interviews matching this query yet.
            </p>
            <Link href="/interview/setup">
              <Button variant="glow" size="sm">
                Start First Mock Interview
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((interview) => {
              const score = interview.overallScore || interview.report?.overallScore || 8.0;
              const scoreTheme = getScoreColor(score);

              return (
                <div
                  key={interview.id}
                  className="rounded-2xl bg-surface border border-white/5 p-5 shadow-xl hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors">
                        {interview.role}
                      </h4>
                      <Badge variant="outline">{interview.level}</Badge>
                      <Badge variant="purple">{interview.interviewType}</Badge>
                      <Badge variant="success">Completed</Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(interview.startedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {interview.durationMinutes} min session
                      </span>
                      <span className="flex items-center gap-1">
                        <Mic className="h-3.5 w-3.5" />
                        {interview.questions.length} questions answered
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        Overall Score
                      </span>
                      <p className={`text-xl font-black ${scoreTheme.text}`}>
                        {score.toFixed(1)} <span className="text-xs text-muted-foreground font-normal">/ 10</span>
                      </p>
                    </div>

                    <Link href={`/history/${interview.id}`}>
                      <Button variant="secondary" size="sm" className="group-hover:bg-primary group-hover:text-white transition-colors">
                        <span>Review</span>
                        <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
