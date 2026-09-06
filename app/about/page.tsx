'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bot, Sparkles, Target, Zap, Shield, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/layout/footer';

export default function AboutPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#070711]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="primary">Our Mission</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Democratizing High-Impact <br />
            <span className="text-gradient">Interview Preparation</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            InterviewAI was created to bridge the gap between technical knowledge and real-world interview execution for students, freshers, and software engineers worldwide.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-surface border border-white/10 p-6 space-y-3 shadow-xl">
            <div className="p-3 rounded-2xl bg-primary/15 text-primary w-fit border border-primary/20">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Realistic Practice</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Interviews shouldn&apos;t be rigid questionnaires. Our AI conducts multi-turn conversations that drill down into the exact tools and architectural choices candidates mention.
            </p>
          </div>

          <div className="rounded-3xl bg-surface border border-white/10 p-6 space-y-3 shadow-xl">
            <div className="p-3 rounded-2xl bg-secondary/15 text-secondary w-fit border border-secondary/20">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Actionable Feedback</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We evaluate using the STAR framework, technical accuracy matrices, and communication scoring so candidates know precisely what to practice next.
            </p>
          </div>

          <div className="rounded-3xl bg-surface border border-white/10 p-6 space-y-3 shadow-xl">
            <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 w-fit border border-emerald-500/20">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Privacy First</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Camera feeds and audio recognition run in browser memory. Uploaded resumes are parsed in real time without permanent storage on public servers.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl bg-gradient-to-r from-primary/20 via-purple-900/20 to-secondary/20 border border-primary/30 p-8 text-center space-y-4 shadow-2xl">
          <h2 className="text-2xl font-bold text-white">Ready to ace your upcoming interview?</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Choose your role and start practicing with your voice in under two minutes.
          </p>
          <div className="pt-2">
            <Link href="/interview/setup">
              <Button variant="glow" size="lg">
                <span>Start Practice Session</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
