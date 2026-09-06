'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AIAvatarProps {
  isSpeaking: boolean;
  voiceGender?: 'male' | 'female';
  roleName?: string;
  subtitleText?: string;
  className?: string;
}

export function AIAvatar({
  isSpeaking,
  voiceGender = 'female',
  roleName = 'Technical Interviewer',
  subtitleText,
  className,
}: AIAvatarProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center relative', className)}>
      {/* Outer Pulse Rings when speaking */}
      <div className="relative flex items-center justify-center">
        {isSpeaking && (
          <>
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute h-36 w-36 rounded-full bg-primary/20 -z-10"
            />
            <motion.div
              animate={{ scale: [1, 1.7, 1], opacity: [0.4, 0.05, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              className="absolute h-48 w-48 rounded-full bg-secondary/15 -z-10"
            />
          </>
        )}

        {/* Center Avatar Hexagon / Circle */}
        <div
          className={cn(
            'h-28 w-28 rounded-3xl p-1 bg-gradient-to-tr transition-all duration-500 shadow-2xl flex items-center justify-center',
            isSpeaking
              ? 'from-primary via-purple-500 to-secondary shadow-primary/40 scale-105 ring-2 ring-primary/50'
              : 'from-white/10 to-white/5 shadow-black/60'
          )}
        >
          <div className="h-full w-full rounded-[22px] bg-[#0d0d18] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Ambient inner glow */}
            <div
              className={cn(
                'absolute inset-0 bg-primary/10 transition-opacity duration-300',
                isSpeaking ? 'opacity-100' : 'opacity-0'
              )}
            />

            <Bot
              className={cn(
                'h-12 w-12 transition-colors duration-300',
                isSpeaking ? 'text-primary animate-pulse' : 'text-muted-foreground'
              )}
            />

            {/* Speaking equalizer bars inside avatar */}
            {isSpeaking && (
              <div className="flex items-center gap-1 mt-2">
                {[40, 80, 60, 100, 50, 75].map((height, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ['20%', `${height}%`, '20%'] }}
                    transition={{
                      duration: 0.6 + i * 0.1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-1 bg-primary rounded-full"
                    style={{ height: '4px', minHeight: '4px', maxHeight: '16px' }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar details */}
      <div className="mt-4 text-center max-w-md px-2">
        <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
          InterviewAI Coach
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </h4>
        <p className="text-xs text-muted-foreground">
          {voiceGender === 'female' ? 'Voice: Sarah (AI)' : 'Voice: Alex (AI)'} • {roleName}
        </p>

        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 text-xs text-primary font-medium mt-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20"
          >
            <Volume2 className="h-3.5 w-3.5 animate-pulse" />
            <span>AI is speaking to candidate...</span>
          </motion.div>
        )}

        {/* Live subtitle box if AI is speaking */}
        {isSpeaking && subtitleText && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[12px] italic text-primary-light/90 mt-2.5 px-3 py-1.5 rounded-lg bg-black/40 border border-primary/20 leading-relaxed shadow-sm"
          >
            &ldquo;{subtitleText}&rdquo;
          </motion.p>
        )}
      </div>
    </div>
  );
}
