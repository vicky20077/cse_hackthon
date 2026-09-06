'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface AudioWaveformProps {
  isActive: boolean;
  barCount?: number;
  colorClass?: string;
  className?: string;
}

export function AudioWaveform({
  isActive,
  barCount = 18,
  colorClass = 'bg-primary',
  className,
}: AudioWaveformProps) {
  return (
    <div className={cn('flex items-center justify-center gap-1 h-8', className)}>
      {Array.from({ length: barCount }).map((_, index) => {
        const heightPattern = Math.sin((index / barCount) * Math.PI) * 100;
        const minHeight = 15;
        const maxHeight = Math.max(minHeight, heightPattern);

        return (
          <motion.div
            key={index}
            animate={
              isActive
                ? {
                    height: [`${minHeight}%`, `${maxHeight}%`, `${minHeight}%`],
                  }
                : {
                    height: '15%',
                  }
            }
            transition={{
              duration: 0.6 + (index % 5) * 0.15,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: (index * 0.05) % 0.4,
            }}
            className={cn('w-1 rounded-full transition-all duration-300', colorClass)}
            style={{
              minHeight: '4px',
              opacity: isActive ? 0.9 : 0.25,
            }}
          />
        );
      })}
    </div>
  );
}
