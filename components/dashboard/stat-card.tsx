'use client';

import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  color?: 'purple' | 'blue' | 'green' | 'amber';
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  color = 'purple',
}: StatCardProps) {
  const colorMap = {
    purple: {
      border: 'hover:border-primary/40',
      iconBg: 'bg-primary/15 text-primary',
      glow: 'shadow-primary/5',
    },
    blue: {
      border: 'hover:border-secondary/40',
      iconBg: 'bg-secondary/15 text-secondary',
      glow: 'shadow-secondary/5',
    },
    green: {
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/15 text-emerald-400',
      glow: 'shadow-emerald-500/5',
    },
    amber: {
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/15 text-amber-400',
      glow: 'shadow-amber-500/5',
    },
  };

  const theme = colorMap[color];

  return (
    <div
      className={cn(
        'rounded-2xl bg-surface border border-white/5 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1',
        theme.border,
        theme.glow
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div className={cn('p-2.5 rounded-xl', theme.iconBg)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        {trend && (
          <span
            className={cn(
              'text-xs font-semibold px-2 py-0.5 rounded-full',
              trendPositive
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-rose-500/15 text-rose-400'
            )}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}
