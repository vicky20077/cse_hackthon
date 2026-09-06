'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface ScoreRingProps {
  score: number; // 0 to 10
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
  animate?: boolean;
}

export function ScoreRing({
  score,
  maxScore = 10,
  size = 140,
  strokeWidth = 10,
  label = 'Overall Score',
  className,
  animate = true,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeColor = '#7C5CFC'; // primary
  if (score >= 8.5) strokeColor = '#22C55E'; // green
  else if (score >= 7.0) strokeColor = '#7C5CFC'; // purple
  else if (score >= 5.0) strokeColor = '#F59E0B'; // amber
  else strokeColor = '#EF4444'; // red

  return (
    <div className={cn('flex flex-col items-center justify-center relative', className)}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={animate ? strokeDashoffset : strokeDashoffset}
            initial={animate ? { strokeDashoffset: circumference } : false}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="none"
            style={{
              filter: `drop-shadow(0 0 8px ${strokeColor}60)`,
            }}
          />
        </svg>

        {/* Center score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={animate ? { opacity: 0, scale: 0.5 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl font-extrabold text-white tracking-tight"
          >
            {score.toFixed(1)}
          </motion.span>
          <span className="text-xs text-muted-foreground font-medium">/ {maxScore}</span>
        </div>
      </div>

      {label && <span className="text-xs font-semibold text-muted-foreground mt-2 tracking-wide uppercase">{label}</span>}
    </div>
  );
}
