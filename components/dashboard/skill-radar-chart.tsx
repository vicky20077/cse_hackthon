'use client';

import * as React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { ProgressBar } from '@/components/ui/progress-bar';

interface SkillBreakdownProps {
  skills: {
    technicalKnowledge: number;
    communication: number;
    confidence: number;
    problemSolving: number;
    relevance: number;
  };
}

export function SkillBreakdownChart({ skills }: SkillBreakdownProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const chartData = [
    { subject: 'Technical', value: skills.technicalKnowledge, fullMark: 100 },
    { subject: 'Communication', value: skills.communication, fullMark: 100 },
    { subject: 'Confidence', value: skills.confidence, fullMark: 100 },
    { subject: 'Problem Solving', value: skills.problemSolving, fullMark: 100 },
    { subject: 'Relevance', value: skills.relevance, fullMark: 100 },
  ];

  const skillBars = [
    { label: 'Technical Knowledge', val: skills.technicalKnowledge, color: 'bg-primary' },
    { label: 'Communication', val: skills.communication, color: 'bg-secondary' },
    { label: 'Confidence', val: skills.confidence, color: 'bg-emerald-400' },
    { label: 'Problem Solving', val: skills.problemSolving, color: 'bg-purple-400' },
    { label: 'Relevance & Precision', val: skills.relevance, color: 'bg-amber-400' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
      {/* Radar Chart */}
      <div className="h-[260px] w-full flex items-center justify-center">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
              <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
              <Radar
                name="Skill Level"
                dataKey="value"
                stroke="#7C5CFC"
                fill="#7C5CFC"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full bg-black/20 rounded-2xl animate-pulse" />
        )}
      </div>

      {/* Progress Bars */}
      <div className="space-y-3.5">
        {skillBars.map((item) => (
          <ProgressBar
            key={item.label}
            label={item.label}
            value={item.val}
            colorClass={item.color}
          />
        ))}
      </div>
    </div>
  );
}
