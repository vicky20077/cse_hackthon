'use client';

import * as React from 'react';
import Link from 'next/link';
import { Shield, Lock, EyeOff, Server, FileCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/layout/footer';

export default function PrivacyPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#070711]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="space-y-3">
          <Badge variant="primary">Privacy Policy</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Your Privacy & Data Security
          </h1>
          <p className="text-xs text-muted-foreground">
            Last updated: August 31, 2026 • InterviewAI Security & Compliance
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-foreground/90 leading-relaxed">
          <div className="rounded-2xl bg-surface border border-white/10 p-6 space-y-3 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <EyeOff className="h-5 w-5 text-emerald-400" />
              1. Video & Audio Stream Handling
            </h3>
            <p className="text-muted-foreground">
              Your camera preview is rendered directly in your browser using standard HTML5 MediaStream APIs. Video is NEVER recorded, uploaded, or transmitted to any server. Audio speech-to-text processing occurs natively in your browser using the Web Speech API.
            </p>
          </div>

          <div className="rounded-2xl bg-surface border border-white/10 p-6 space-y-3 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              2. Resume Document Processing
            </h3>
            <p className="text-muted-foreground">
              When you upload a PDF or DOCX resume, text is parsed transiently in server memory solely to extract skills and project titles for dynamic question generation. Resumes are not permanently written to cloud storage unless you explicitly save them to your encrypted profile.
            </p>
          </div>

          <div className="rounded-2xl bg-surface border border-white/10 p-6 space-y-3 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-secondary" />
              3. AI Provider Interactions
            </h3>
            <p className="text-muted-foreground">
              When using Google Gemini or OpenAI API keys, prompts contain only the relevant question and your answer text for scoring purposes. No personally identifying information or video frames are dispatched.
            </p>
          </div>

          <div className="rounded-2xl bg-surface border border-white/10 p-6 space-y-3 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="h-5 w-5 text-purple-400" />
              4. Data Retention & Control
            </h3>
            <p className="text-muted-foreground">
              You retain 100% ownership of your interview practice transcripts and scores. You can reset or clear all session history and cached profile attributes at any time from the Settings page.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
