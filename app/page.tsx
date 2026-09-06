'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mic,
  Sparkles,
  Bot,
  ArrowRight,
  CheckCircle2,
  FileText,
  TrendingUp,
  Brain,
  Layers,
  Search,
  Volume2,
  Shield,
  Zap,
  Code2,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROLE_PRESETS } from '@/lib/store/mock-data';
import { AudioWaveform } from '@/components/interview/audio-waveform';
import { Footer } from '@/components/layout/footer';

export default function LandingPage() {
  const [roleSearch, setRoleSearch] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string>('All');
  const [isSimulatedSpeaking, setIsSimulatedSpeaking] = React.useState(true);

  // Simulated Voice Waveform interval
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsSimulatedSpeaking((prev) => !prev);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const filteredRoles = ROLE_PRESETS.filter((role) => {
    const matchesSearch =
      role.title.toLowerCase().includes(roleSearch.toLowerCase()) ||
      role.keySkills.some((s) => s.toLowerCase().includes(roleSearch.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || role.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const companies = [
    { name: 'Google', note: 'System Design & DSA' },
    { name: 'Amazon', note: 'Leadership Principles' },
    { name: 'Microsoft', note: 'Cloud & Architecture' },
    { name: 'TCS', note: 'CS Core & Fundamentals' },
    { name: 'Infosys', note: 'Technical & Logic' },
    { name: 'Zoho', note: 'Full Stack & DBMS' },
    { name: 'Flipkart', note: 'High Scale & Concurrency' },
    { name: 'Accenture', note: 'Behavioral & Solutions' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/20 blur-[130px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Generation AI Interview Coach</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]"
              >
                Your Next Interview <br />
                <span className="text-gradient">Starts With Practice.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Practice realistic AI interviews, answer naturally with your voice, and receive instant feedback that helps you improve.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <Link href="/interview/setup" className="w-full sm:w-auto">
                  <Button variant="glow" size="lg" className="w-full sm:w-auto text-base">
                    <Mic className="h-5 w-5 mr-2" />
                    <span>Start Mock Interview</span>
                  </Button>
                </Link>

                <a href="#how-it-works" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
                    <span>See How It Works</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </a>
              </motion.div>

              {/* Highlights badge list */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Real Browser Voice STT / TTS
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Dynamic Follow-up AI
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  STAR Method Score
                </span>
              </div>
            </div>

            {/* Right Column: Animated Simulated Live Interview Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-3xl bg-[#11111C]/90 border border-primary/30 p-6 shadow-2xl shadow-primary/20 backdrop-blur-xl space-y-5">
                {/* Header status */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        AI Interviewer
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      </h4>
                      <p className="text-[11px] text-muted-foreground">Full Stack Developer • Question 1 of 5</p>
                    </div>
                  </div>
                  <Badge variant="primary">08:45</Badge>
                </div>

                {/* AI Question Box */}
                <div className="rounded-2xl bg-black/40 border border-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-primary font-semibold">
                    <span className="flex items-center gap-1">
                      <Volume2 className="h-3.5 w-3.5" />
                      {isSimulatedSpeaking ? 'AI is speaking question...' : 'Waiting for answer...'}
                    </span>
                    <AudioWaveform isActive={isSimulatedSpeaking} barCount={12} colorClass="bg-primary" />
                  </div>
                  <p className="text-sm font-semibold text-white leading-relaxed">
                    &quot;Tell me about a challenging full-stack project you worked on, and how you handled database performance or query optimization?&quot;
                  </p>
                </div>

                {/* Simulated Candidate Audio & Response */}
                <div className="rounded-2xl bg-surface-card border border-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Listening indicator • Candidate Speaking
                    </span>
                    <span className="text-[11px]">STAR Method Active</span>
                  </div>

                  <p className="text-xs text-foreground/90 leading-relaxed italic bg-black/30 p-3 rounded-xl border border-white/5">
                    &quot;In my recent e-commerce platform, search queries were taking 2 seconds. I profiled PostgreSQL queries with EXPLAIN ANALYZE, created composite B-Tree indexes, and added Redis caching, which reduced latency to 80ms...&quot;
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                        <Mic className="h-4 w-4" />
                      </div>
                      <AudioWaveform isActive={!isSimulatedSpeaking} barCount={10} colorClass="bg-emerald-400" />
                    </div>

                    <div className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                      Adaptive Follow-up Ready
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TRUST SECTION */}
      <section className="py-12 border-y border-white/5 bg-[#0a0a14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Industry Aligned Preparation
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Practice for the roles you actually want
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl mx-auto">
              Practice interview styles inspired by common industry expectations across top tech firms and IT service leaders.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
            {companies.map((co) => (
              <div
                key={co.name}
                className="rounded-xl bg-surface border border-white/5 p-3 flex flex-col items-center justify-center hover:border-primary/40 transition-colors shadow-md"
              >
                <span className="font-extrabold text-white text-sm tracking-tight">{co.name}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">{co.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <Badge variant="primary">Simple 3-Step Process</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How InterviewAI Works
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            From role customization to adaptive voice evaluation in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="rounded-2xl bg-surface border border-white/5 p-8 relative space-y-4 hover:border-primary/40 transition-all shadow-xl group">
            <span className="text-4xl font-black text-primary/30 group-hover:text-primary transition-colors">
              01
            </span>
            <h3 className="text-xl font-bold text-white">Choose Your Role</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Select from 16+ predefined tech and business roles or input a custom role. Pick your experience level and optionally upload your resume.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl bg-surface border border-white/5 p-8 relative space-y-4 hover:border-primary/40 transition-all shadow-xl group">
            <span className="text-4xl font-black text-secondary/30 group-hover:text-secondary transition-colors">
              02
            </span>
            <h3 className="text-xl font-bold text-white">Complete Your Interview</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Answer questions naturally via microphone. The AI interviewer adapts dynamically, asking follow-up questions based on your technical decisions.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl bg-surface border border-white/5 p-8 relative space-y-4 hover:border-primary/40 transition-all shadow-xl group">
            <span className="text-4xl font-black text-emerald-500/30 group-hover:text-emerald-400 transition-colors">
              03
            </span>
            <h3 className="text-xl font-bold text-white">Get Your AI Feedback</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Receive a comprehensive score report, STAR behavioral analysis, strengths, improvement areas, and ideal answer structures for every question.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section id="features" className="py-20 border-t border-white/5 bg-[#090912]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <Badge variant="purple">Platform Capabilities</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered For High-Performance Interview Prep
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Everything you need to turn interview anxiety into confident mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl bg-surface border border-white/5 p-6 space-y-3 hover:border-primary/40 transition-all shadow-xl hover:-translate-y-1">
              <div className="p-3 rounded-xl bg-primary/15 text-primary w-fit border border-primary/20">
                <Mic className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white">AI Voice Interviews</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Talk naturally with an AI interviewer using real-time browser speech recognition and natural speech synthesis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl bg-surface border border-white/5 p-6 space-y-3 hover:border-secondary/40 transition-all shadow-xl hover:-translate-y-1">
              <div className="p-3 rounded-xl bg-secondary/15 text-secondary w-fit border border-secondary/20">
                <FileText className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Resume-Based Questions</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Upload your PDF or DOCX resume and receive personalized questions tailored specifically to your real projects and listed skills.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl bg-surface border border-white/5 p-6 space-y-3 hover:border-purple-400/40 transition-all shadow-xl hover:-translate-y-1">
              <div className="p-3 rounded-xl bg-purple-500/15 text-purple-400 w-fit border border-purple-500/20">
                <Zap className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Adaptive Follow-Ups</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                AI dynamically probes your answers. If you mention MongoDB or Redis, expect targeted questions testing your architectural reasoning.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl bg-surface border border-white/5 p-6 space-y-3 hover:border-emerald-400/40 transition-all shadow-xl hover:-translate-y-1">
              <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 w-fit border border-emerald-500/20">
                <Brain className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Instant Feedback</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Receive detailed question-by-question scoring across Technical Accuracy, Communication, Confidence, and Problem Solving.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl bg-surface border border-white/5 p-6 space-y-3 hover:border-amber-400/40 transition-all shadow-xl hover:-translate-y-1">
              <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 w-fit border border-amber-500/20">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Performance Tracking</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Track your scores, strengths, and weaknesses over time with radar charts and historical score progression graphs.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl bg-surface border border-white/5 p-6 space-y-3 hover:border-primary/40 transition-all shadow-xl hover:-translate-y-1">
              <div className="p-3 rounded-xl bg-primary/15 text-primary w-fit border border-primary/20">
                <Layers className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Role-Specific Preparation</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Practice Technical, HR/Behavioral with STAR analysis, Mixed, or System Design rounds across 16+ engineering tracks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERVIEW LEVELS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <Badge variant="primary">Experience Levels</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tailored To Your Career Stage
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            From college placements to senior engineering leadership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Internship */}
          <div className="rounded-2xl bg-surface border border-white/5 p-6 space-y-4 hover:border-primary/40 transition-all shadow-xl">
            <Badge variant="outline">Students & Beginners</Badge>
            <h3 className="text-2xl font-bold text-white">Internship</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Designed for college students aiming for their first software internship.
            </p>
            <div className="pt-2 space-y-2 text-xs text-foreground/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Basic technical questions & algorithms</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>College projects & coursework deep dives</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>CS Fundamentals & Behavioral basics</span>
              </div>
            </div>
          </div>

          {/* Fresher */}
          <div className="rounded-2xl bg-surface border border-primary/30 p-6 space-y-4 hover:border-primary/60 transition-all shadow-xl shadow-primary/10 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <Badge variant="primary">Recent Graduates</Badge>
              <span className="text-[10px] uppercase font-bold text-primary bg-primary/15 px-2 py-0.5 rounded-full border border-primary/20">
                Most Popular
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white">Fresher</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Focused on campus placements and entry-level developer hiring rounds.
            </p>
            <div className="pt-2 space-y-2 text-xs text-foreground/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Technical fundamentals & DSA problem solving</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>DBMS, OS, OOP, Computer Networks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>STAR Method HR & Behavioral evaluation</span>
              </div>
            </div>
          </div>

          {/* Experienced */}
          <div className="rounded-2xl bg-surface border border-white/5 p-6 space-y-4 hover:border-secondary/40 transition-all shadow-xl">
            <Badge variant="secondary">Professionals</Badge>
            <h3 className="text-2xl font-bold text-white">Experienced</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Challenging technical interviews for lateral hires and senior engineers.
            </p>
            <div className="pt-2 space-y-2 text-xs text-foreground/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-secondary shrink-0" />
                <span>Advanced architecture & distributed systems</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-secondary shrink-0" />
                <span>System design & scale tradeoffs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-secondary shrink-0" />
                <span>Technical leadership & cross-functional scenarios</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERVIEW ROLES GRID */}
      <section id="roles" className="py-20 border-t border-white/5 bg-[#070711]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="primary">Practice Roles</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Choose From 16+ Specialized Roles
              </h2>
              <p className="text-sm text-muted-foreground">
                Or enter any custom job title in the interview setup wizard.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search roles or skills..."
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-surface border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredRoles.map((role) => (
              <Link
                key={role.id}
                href={`/interview/setup?role=${encodeURIComponent(role.title)}`}
                className="rounded-2xl bg-surface border border-white/5 p-5 hover:border-primary/40 transition-all duration-200 hover:-translate-y-1 shadow-lg group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                      {role.category}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors">
                    {role.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-xs text-primary font-semibold">
                  <span>Start Practice</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA BANNER */}
      <section className="py-20 bg-gradient-to-b from-[#0e0e1c] to-[#070711] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <Badge variant="glow">Ready To Level Up?</Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Stop Guessing. <br />
            <span className="text-gradient">Start Practicing With AI Today.</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Boost your interview confidence, improve your STAR communication, and get hired faster with actionable feedback.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/interview/setup" className="w-full sm:w-auto">
              <Button variant="glow" size="lg" className="w-full sm:w-auto">
                <Mic className="h-5 w-5 mr-2" />
                <span>Start Free Mock Interview</span>
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <span>Go to Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
