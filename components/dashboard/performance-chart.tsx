'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PerformanceChartProps {
  data: {
    id: string;
    date: string;
    score: number;
    role: string;
  }[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-[280px] w-full bg-black/20 rounded-2xl animate-pulse" />;
  }

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C5CFC" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 10]}
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            ticks={[0, 2, 4, 6, 8, 10]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="rounded-xl bg-[#11111C] border border-white/10 p-3 shadow-xl text-xs">
                    <p className="font-bold text-white">{item.role}</p>
                    <p className="text-muted-foreground mt-0.5">{item.date}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-primary font-bold text-sm">
                      <span>Score:</span>
                      <span>{item.score} / 10</span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#7C5CFC"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#scoreGradient)"
            dot={{ fill: '#7C5CFC', stroke: '#070711', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
