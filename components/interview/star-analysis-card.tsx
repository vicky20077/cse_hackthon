'use client';

import * as React from 'react';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { StarAnalysis } from '@/types/interview';
import { Badge } from '@/components/ui/badge';

interface StarAnalysisCardProps {
  analysis: StarAnalysis;
}

export function StarAnalysisCard({ analysis }: StarAnalysisCardProps) {
  const items = [
    { key: 'Situation', data: analysis.situation },
    { key: 'Task', data: analysis.task },
    { key: 'Action', data: analysis.action },
    { key: 'Result', data: analysis.result },
  ];

  return (
    <div className="rounded-2xl bg-surface-card border border-purple-500/20 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <h4 className="text-sm font-bold text-white">STAR Method Evaluation</h4>
        </div>
        <Badge variant="purple">
          STAR Score: {analysis.overallStarScore.toFixed(1)} / 10
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map(({ key, data }) => (
          <div
            key={key}
            className="rounded-xl bg-black/40 border border-white/5 p-3 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{key}</span>
              {data.present ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {data.feedback}
            </p>
          </div>
        ))}
      </div>

      {analysis.advice && (
        <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-3 text-xs text-purple-200">
          <span className="font-semibold text-purple-300">Coach Advice: </span>
          {analysis.advice}
        </div>
      )}
    </div>
  );
}
