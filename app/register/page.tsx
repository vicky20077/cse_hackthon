'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, Sparkles, Lock, Mail, User, Briefcase, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { setUserAuthenticated, saveStoredUser } from '@/lib/store/user-store';
import { DEMO_USER } from '@/lib/store/mock-data';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [targetRole, setTargetRole] = React.useState('Full Stack Developer');
  const [level, setLevel] = React.useState<'Internship' | 'Fresher' | 'Experienced'>('Fresher');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newUser = {
      ...DEMO_USER,
      name: name || 'Candidate',
      email: email || 'candidate@example.com',
      targetRole,
      experienceLevel: level,
    };

    setTimeout(() => {
      saveStoredUser(newUser);
      setUserAuthenticated(true);
      toast({
        type: 'success',
        title: 'Account created!',
        description: `Welcome to InterviewAI, ${name || 'Candidate'}! Starting your journey...`,
      });
      setIsLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <Bot className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black text-white">InterviewAI</span>
          </Link>
          <h2 className="text-xl font-bold text-white pt-2">Create Your Account</h2>
          <p className="text-xs text-muted-foreground">
            Join thousands of developers mastering high-impact interviews.
          </p>
        </div>

        <div className="rounded-2xl bg-surface border border-white/10 p-6 shadow-2xl space-y-5">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Yogesh Sharma"
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

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
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  Target Role
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="AI/ML Engineer">AI/ML Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Experience Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="Internship">Internship</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>
            </div>

            <Button type="submit" variant="glow" className="w-full mt-2" isLoading={isLoading}>
              Create Free Account
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
