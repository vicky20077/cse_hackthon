'use client';

import * as React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { formatDuration } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';

interface InterviewTimerProps {
  initialMinutes: number;
  onTimeExpired?: () => void;
  isPaused?: boolean;
}

export function InterviewTimer({
  initialMinutes,
  onTimeExpired,
  isPaused = false,
}: InterviewTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = React.useState(initialMinutes * 60);

  React.useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeExpired?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, onTimeExpired]);

  const isLowTime = secondsRemaining < 120; // under 2 minutes
  const isCriticalTime = secondsRemaining < 60; // under 1 minute

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md transition-colors',
        isCriticalTime
          ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse'
          : isLowTime
          ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
          : 'bg-white/5 border-white/10 text-foreground'
      )}
    >
      <Clock className="h-3.5 w-3.5" />
      <span>{formatDuration(secondsRemaining)} remaining</span>
    </div>
  );
}
