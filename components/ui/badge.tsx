import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'purple' | 'glow';
}

export function Badge({ className, variant = 'primary', children, ...props }: BadgeProps) {
  const variants = {
    primary: 'bg-primary/15 text-primary border-primary/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    secondary: 'bg-secondary/15 text-secondary border-secondary/30',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    error: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    outline: 'bg-white/5 text-muted-foreground border-white/10',
    glow: 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border-primary/40 shadow-lg shadow-primary/20',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
