'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bot, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#070711] text-muted-foreground text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white">
                <Bot className="h-4 w-4" />
              </div>
              <span className="text-base font-extrabold text-white">InterviewAI</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Practice realistic AI interviews, answer naturally with voice, and receive instant feedback that helps you get hired.
            </p>
            <p className="text-xs text-muted-foreground/60">
              © {new Date().getFullYear()} InterviewAI Inc. All rights reserved.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/interview/setup" className="hover:text-white transition-colors">
                  Start Mock Interview
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Performance Dashboard
                </Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-white transition-colors">
                  Resume Hub & Parser
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-white transition-colors">
                  Review Past Sessions
                </Link>
              </li>
            </ul>
          </div>

          {/* Roles */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Popular Roles</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/interview/setup" className="hover:text-white transition-colors">
                  Full Stack Developer
                </Link>
              </li>
              <li>
                <Link href="/interview/setup" className="hover:text-white transition-colors">
                  AI/ML Engineer
                </Link>
              </li>
              <li>
                <Link href="/interview/setup" className="hover:text-white transition-colors">
                  Backend & Systems
                </Link>
              </li>
              <li>
                <Link href="/interview/setup" className="hover:text-white transition-colors">
                  Data Scientist
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Company & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About InterviewAI
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-white transition-colors">
                  AI Key Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
