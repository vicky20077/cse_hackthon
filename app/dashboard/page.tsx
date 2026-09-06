'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Mic,
  Award,
  TrendingUp,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  PlusCircle,
  FileText,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { StatCard } from '@/components/dashboard/stat-card';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { SkillBreakdownChart } from '@/components/dashboard/skill-radar-chart';
import { RecentInterviewCard } from '@/components/dashboard/recent-interview-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getStoredUser, getStoredStats } from '@/lib/store/user-store';
import { getStoredSessions } from '@/lib/store/interview-store';
import { UserProfile, UserStats } from '@/types/user';
import { InterviewSession } from '@/types/interview';

export default function DashboardPage() {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [stats, setStats] = React.useState<UserStats | null>(null);
  const [sessions, setSessions] = React.useState<InterviewSession[]>([]);

  React.useEffect(() => {
    setUser(getStoredUser());
    setStats(getStoredStats());
    setSessions(getStoredSessions());
  }, []);

  if (!user || !stats) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const recentSessions = sessions.slice(0, 4);

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#070711]">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Welcome back, {user.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Targeting: <span className="text-white font-semibold">{user.targetRole}</span> • {user.experienceLevel} Level
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/interview/setup">
              <Button variant="glow" size="md">
                <Mic className="h-4 w-4 mr-2" />
                <span>Start Mock Interview</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Top 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Interviews Completed"
            value={stats.interviewsCompleted}
            subtitle="Total mock sessions"
            icon={CheckCircle2}
            trend="+3 this week"
            trendPositive={true}
            color="purple"
          />
          <StatCard
            title="Average Score"
            value={`${stats.averageScore.toFixed(1)}/10`}
            subtitle="Across all evaluations"
            icon={Award}
            trend="+0.6 improvement"
            trendPositive={true}
            color="blue"
          />
          <StatCard
            title="Best Score"
            value={`${stats.bestScore.toFixed(1)}/10`}
            subtitle="Highest achieved"
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            subtitle="Consecutive practice"
            icon={Flame}
            color="amber"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Performance Overview (Line Chart) */}
          <div className="lg:col-span-7 rounded-2xl bg-surface border border-white/5 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Performance Overview</h3>
                <p className="text-xs text-muted-foreground">
                  Score progression over your last 10 mock interviews
                </p>
              </div>
              <Badge variant="primary">Last 10 Sessions</Badge>
            </div>
            <PerformanceChart data={stats.scoreHistory} />
          </div>

          {/* Skill Breakdown (Radar & Progress) */}
          <div className="lg:col-span-5 rounded-2xl bg-surface border border-white/5 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Skill Breakdown</h3>
                <p className="text-xs text-muted-foreground">
                  5-dimensional interview competency
                </p>
              </div>
              <Badge variant="purple">AI Evaluated</Badge>
            </div>
            <SkillBreakdownChart skills={stats.skillBreakdown} />
          </div>
        </div>

        {/* Recent Interviews Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Interviews</h3>
              <p className="text-xs text-muted-foreground">
                Review questions, transcripts, and AI coaching suggestions
              </p>
            </div>

            <Link href="/history" className="text-xs font-semibold text-primary hover:text-white transition-colors flex items-center gap-1">
              <span>View All History</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {recentSessions.map((session) => (
              <RecentInterviewCard key={session.id} interview={session} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
