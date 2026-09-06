'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X, ArrowRight, Shield, Mic, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isDashboardPage =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/interview') ||
    pathname.startsWith('/history') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/resume') ||
    pathname.startsWith('/settings');

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#070711]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
              InterviewAI
              <span className="text-[10px] uppercase font-bold tracking-widest bg-primary/20 text-primary px-1.5 py-0.2 rounded border border-primary/30">
                PRO
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        {!isDashboardPage && (
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <a href="/#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="/#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="/#roles" className="hover:text-white transition-colors">
              Practice Roles
            </a>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
          </div>
        )}

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isDashboardPage ? (
            <Link href="/interview/setup">
              <Button variant="glow" size="sm">
                <Mic className="h-4 w-4 mr-1.5" />
                Start Mock Interview
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/interview/setup">
                <Button variant="glow" size="sm">
                  <span>Start Free Interview</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#070711] px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-muted-foreground hover:text-white"
          >
            Home
          </Link>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-muted-foreground hover:text-white"
          >
            How It Works
          </a>
          <a
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-muted-foreground hover:text-white"
          >
            Features
          </a>
          <a
            href="/#roles"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-muted-foreground hover:text-white"
          >
            Practice Roles
          </a>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-primary hover:text-white"
          >
            Dashboard
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/interview/setup" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="glow" className="w-full">
                Start Mock Interview
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
