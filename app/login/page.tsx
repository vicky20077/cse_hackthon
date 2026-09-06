'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, Sparkles, ArrowRight, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { setUserAuthenticated } from '@/lib/store/user-store';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = React.useState('yogesh.dev@interviewai.io');
  const [password, setPassword] = React.useState('password123');
  const [isLoading, setIsLoading] = React.useState(false);
  const [forgotModalOpen, setForgotModalOpen] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setUserAuthenticated(true);
      toast({
        type: 'success',
        title: 'Welcome back!',
        description: 'Signed in successfully. Redirecting to your dashboard...',
      });
      setIsLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  const handleDemoLogin = () => {
    setUserAuthenticated(true);
    toast({
      type: 'success',
      title: 'Demo Session Active',
      description: 'Logged in as Yogesh with 12 completed mock interviews & analytics.',
    });
    router.push('/dashboard');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotModalOpen(false);
    toast({
      type: 'info',
      title: 'Password reset link sent',
      description: `If an account exists for ${resetEmail}, an email has been sent.`,
    });
    setResetEmail('');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <Bot className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black text-white">InterviewAI</span>
          </Link>
          <h2 className="text-xl font-bold text-white pt-2">Welcome Back</h2>
          <p className="text-xs text-muted-foreground">
            Sign in to continue practicing and tracking your interview growth.
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/20 via-purple-900/30 to-secondary/20 border border-primary/30 p-4 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              Quick Demo Access
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Zero Setup
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Test the live interview engine, dashboard charts, and feedback reviews immediately with 1-click.
          </p>
          <Button variant="glow" size="sm" onClick={handleDemoLogin} className="w-full mt-1">
            <span>Instant Demo Sign In</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>

        {/* Standard Auth Card */}
        <div className="rounded-2xl bg-surface border border-white/10 p-6 shadow-2xl space-y-5">
          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-all hover:scale-[1.01]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-surface px-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground absolute">
              Or email
            </span>
          </div>

          {/* Email form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Your Password"
        description="Enter your email address and we'll send you a password recovery link."
      >
        <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
            <input
              type="email"
              required
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setForgotModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Reset Link
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
