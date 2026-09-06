'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sparkles, Settings } from 'lucide-react';

export function DemoBanner() {
  return (
    <div className="bg-gradient-to-r from-primary/20 via-purple-900/20 to-secondary/20 border-b border-primary/20 px-4 py-1.5 text-xs text-muted-foreground flex items-center justify-between">
      <div className="flex items-center gap-2 mx-auto sm:mx-0">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-medium text-foreground">Demo Mode Active:</span>
        <span className="hidden sm:inline">Realistic AI evaluation & voice engine enabled without API key requirements.</span>
      </div>
      <Link
        href="/settings"
        className="hidden sm:flex items-center gap-1 text-primary hover:text-white transition-colors font-medium ml-auto"
      >
        <Settings className="h-3.5 w-3.5" />
        <span>Configure AI Keys</span>
      </Link>
    </div>
  );
}
