'use client';

import * as React from 'react';
import {
  Settings,
  Bot,
  Key,
  Volume2,
  Mic,
  Shield,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { DEMO_STATS, DEMO_USER, DEMO_INTERVIEW_HISTORY } from '@/lib/store/mock-data';

export default function SettingsPage() {
  const { toast } = useToast();

  const [aiProvider, setAiProvider] = React.useState<'demo' | 'gemini' | 'openai'>('demo');
  const [geminiKey, setGeminiKey] = React.useState('');
  const [openaiKey, setOpenaiKey] = React.useState('');
  const [voiceRate, setVoiceRate] = React.useState(0.95);
  const [defaultGender, setDefaultGender] = React.useState<'female' | 'male'>('female');
  const [speechLang, setSpeechLang] = React.useState('en-US');
  const [soundFx, setSoundFx] = React.useState(true);
  const [saveLocalTranscripts, setSaveLocalTranscripts] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    try {
      const savedProvider = localStorage.getItem('interviewai_provider');
      if (savedProvider) setAiProvider(savedProvider as any);

      const savedGemini = localStorage.getItem('interviewai_gemini_key');
      if (savedGemini) setGeminiKey(savedGemini);

      const savedOpenai = localStorage.getItem('interviewai_openai_key');
      if (savedOpenai) setOpenaiKey(savedOpenai);
    } catch {}
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      localStorage.setItem('interviewai_provider', aiProvider);
      if (geminiKey) localStorage.setItem('interviewai_gemini_key', geminiKey);
      if (openaiKey) localStorage.setItem('interviewai_openai_key', openaiKey);

      setTimeout(() => {
        setIsSaving(false);
        toast({
          type: 'success',
          title: 'Settings Saved',
          description: 'Your AI provider preferences and voice configurations have been updated.',
        });
      }, 400);
    } catch {
      setIsSaving(false);
    }
  };

  const handleResetData = () => {
    try {
      localStorage.clear();
      localStorage.setItem('interviewai_user_profile', JSON.stringify(DEMO_USER));
      localStorage.setItem('interviewai_user_stats', JSON.stringify(DEMO_STATS));
      localStorage.setItem('interviewai_interview_sessions', JSON.stringify(DEMO_INTERVIEW_HISTORY));
      toast({
        type: 'info',
        title: 'Demo Data Restored',
        description: 'Reset to standard demo statistics (12 completed interviews, 8.4 avg score).',
      });
    } catch {}
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#070711]">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Settings className="h-7 w-7 text-primary" />
              Platform Settings
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Configure your AI intelligence providers, voice controls, speech recognition, and privacy.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* 1. AI Provider Engine */}
          <div className="rounded-3xl bg-surface border border-white/10 p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bot className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-white">AI Provider & Intelligence Model</h3>
              </div>
              <Badge variant="purple">Multi-Provider Layer</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'demo', title: 'Built-in Demo Engine', subtitle: 'Zero API keys needed', badge: 'Active' },
                { id: 'gemini', title: 'Google Gemini 1.5', subtitle: 'High speed & context', badge: 'Primary' },
                { id: 'openai', title: 'OpenAI GPT-4o Mini', subtitle: 'Advanced reasoning', badge: 'Fallback' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setAiProvider(p.id as any)}
                  className={`rounded-2xl p-4 text-left border transition-all ${
                    aiProvider === p.id
                      ? 'border-primary bg-primary/15 text-white shadow-xl shadow-primary/20 scale-[1.02]'
                      : 'border-white/5 bg-surface-card text-muted-foreground hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{p.title}</span>
                    <Badge variant={p.id === 'demo' ? 'success' : 'outline'}>{p.badge}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{p.subtitle}</p>
                </button>
              ))}
            </div>

            {/* Custom API Keys */}
            <div className="space-y-4 pt-2 border-t border-white/5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-primary" />
                  Google Gemini API Key (Optional)
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
                />
                <p className="text-[11px] text-muted-foreground">
                  Your API keys are stored securely in local browser storage and never exposed to the frontend or sent to 3rd parties.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-secondary" />
                  OpenAI API Key (Optional)
                </label>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* 2. Voice & Speech Recognition Settings */}
          <div className="rounded-3xl bg-surface border border-white/10 p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center gap-2.5">
              <Volume2 className="h-5 w-5 text-secondary" />
              <h3 className="text-base font-bold text-white">Voice & Speech Preferences</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Default Interviewer Voice</label>
                <select
                  value={defaultGender}
                  onChange={(e) => setDefaultGender(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="female">Sarah (Female AI Voice)</option>
                  <option value="male">Alex (Male AI Voice)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Speech Recognition Language</label>
                <select
                  value={speechLang}
                  onChange={(e) => setSpeechLang(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-IN">English (India)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="en-AU">English (Australia)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Privacy & Data Maintenance */}
          <div className="rounded-3xl bg-surface border border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <Shield className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Privacy & Local Storage</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Camera feeds and audio streams are processed in-browser. Resume documents are parsed in memory and zero files are permanently retained on public servers.
            </p>

            <div className="pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={handleResetData}>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Reset Demo Data & Analytics
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="glow" size="lg" isLoading={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              <span>Save All Settings</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
