'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  GraduationCap,
  Briefcase,
  FileText,
  Clock,
  Volume2,
  CheckCircle2,
  Bot,
  User,
  Plus,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResumeUploader } from '@/components/resume/resume-uploader';
import { ROLE_PRESETS } from '@/lib/store/mock-data';
import { saveSession } from '@/lib/store/interview-store';
import { ExperienceLevel, InterviewType } from '@/types/interview';
import { ParsedResume } from '@/types/resume';
import { useToast } from '@/components/ui/toast';
import { sounds } from '@/lib/utils/sound-effects';

function SetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const queryRole = searchParams.get('role');

  const [currentStep, setCurrentStep] = React.useState(1);
  const [selectedRole, setSelectedRole] = React.useState(queryRole || 'Full Stack Developer');
  const [customRoleInput, setCustomRoleInput] = React.useState('');
  const [isCustomRole, setIsCustomRole] = React.useState(false);
  const [selectedLevel, setSelectedLevel] = React.useState<ExperienceLevel>('Fresher');
  const [selectedType, setSelectedType] = React.useState<InterviewType>('Technical');
  const [resumeData, setResumeData] = React.useState<ParsedResume | null>(null);
  const [durationMinutes, setDurationMinutes] = React.useState<number>(10);
  const [voiceGender, setVoiceGender] = React.useState<'male' | 'female'>('female');
  const [isLaunching, setIsLaunching] = React.useState(false);

  const totalSteps = 7;

  const handleStartInterview = async () => {
    setIsLaunching(true);
    sounds.playStart();

    const finalRole = isCustomRole && customRoleInput.trim() ? customRoleInput.trim() : selectedRole;

    try {
      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: finalRole,
          customRole: isCustomRole ? customRoleInput : undefined,
          level: selectedLevel,
          interviewType: selectedType,
          durationMinutes,
          voiceGender,
          resumeSkills: resumeData?.skills || [],
        }),
      });

      const data = await response.json();
      if (data.success && data.session) {
        saveSession(data.session);
        toast({
          type: 'success',
          title: 'Session Ready 🚀',
          description: `Starting interview for ${finalRole}...`,
        });
        router.push(`/interview/${data.session.id}`);
      } else {
        throw new Error(data.error || 'Initialization failed');
      }
    } catch (err: unknown) {
      console.warn('API error, creating local fallback session:', err);
      // Seamless local fallback
      const fallbackSession = {
        id: `session_${Date.now()}`,
        userId: 'demo-user-123',
        role: finalRole,
        level: selectedLevel,
        interviewType: selectedType,
        durationMinutes,
        voiceGender,
        currentQuestionIndex: 0,
        status: 'in_progress' as const,
        startedAt: new Date().toISOString(),
        questions: [
          {
            id: `q_${Date.now()}_1`,
            interviewId: `session_${Date.now()}`,
            questionNumber: 1,
            question: `Welcome! Let's begin your ${finalRole} interview. Could you explain the difference between authentication and authorization in a web application?`,
            questionType: 'technical' as const,
            difficulty: 'Easy' as const,
            category: finalRole,
          },
        ],
      };
      saveSession(fallbackSession);
      router.push(`/interview/${fallbackSession.id}`);
    } finally {
      setIsLaunching(false);
    }
  };

  const estimatedQuestions = Math.max(3, Math.round(durationMinutes / 2));

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#070711]">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-8">
        {/* Wizard Progress Top Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-bold text-white uppercase tracking-wider">
              Step {currentStep} of {totalSteps}
            </span>
            <span>
              {currentStep === 1 && 'Select Target Role'}
              {currentStep === 2 && 'Select Experience Level'}
              {currentStep === 3 && 'Select Interview Type'}
              {currentStep === 4 && 'Resume Personalization (Optional)'}
              {currentStep === 5 && 'Interview Duration'}
              {currentStep === 6 && 'Interviewer Voice'}
              {currentStep === 7 && 'Confirm & Launch'}
            </span>
          </div>

          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Contents */}
        <div className="rounded-3xl bg-surface border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6 min-h-[420px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* STEP 1: SELECT ROLE */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-black text-white">Select Your Target Role</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pick from 16+ popular domains or specify any custom position.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {ROLE_PRESETS.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.title);
                        setIsCustomRole(false);
                      }}
                      className={`rounded-2xl p-4 text-left border transition-all ${
                        !isCustomRole && selectedRole === role.title
                          ? 'border-primary bg-primary/15 text-white shadow-lg shadow-primary/20 scale-[1.02]'
                          : 'border-white/5 bg-surface-card text-muted-foreground hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold text-primary">
                        {role.category}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{role.title}</h4>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                        {role.keySkills.slice(0, 3).join(', ')}
                      </p>
                    </button>
                  ))}

                  {/* Custom Role Option */}
                  <button
                    type="button"
                    onClick={() => setIsCustomRole(true)}
                    className={`rounded-2xl p-4 text-left border transition-all flex flex-col justify-center ${
                      isCustomRole
                        ? 'border-primary bg-primary/15 text-white shadow-lg shadow-primary/20 scale-[1.02]'
                        : 'border-dashed border-white/20 bg-surface-card text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-primary font-bold text-xs">
                      <Plus className="h-4 w-4" />
                      <span>Custom Role</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Enter any specific job title
                    </p>
                  </button>
                </div>

                {isCustomRole && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-2"
                  >
                    <input
                      type="text"
                      value={customRoleInput}
                      onChange={(e) => setCustomRoleInput(e.target.value)}
                      placeholder="e.g. Lead Blockchain Architect, Site Reliability Engineer..."
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-primary/40 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* STEP 2: EXPERIENCE LEVEL */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-black text-white">Select Experience Level</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI adapts question depth and complexity accordingly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'Internship',
                      title: 'Internship',
                      desc: 'For students and beginners. Focuses on fundamentals, basic DSA, college projects, and enthusiasm.',
                    },
                    {
                      id: 'Fresher',
                      title: 'Fresher / Entry Level',
                      desc: 'For recent graduates. Focuses on CS core (DBMS, OS, OOP), problem solving, and behavioral STAR rounds.',
                    },
                    {
                      id: 'Experienced',
                      title: 'Experienced (2+ Years)',
                      desc: 'For professionals. Focuses on advanced system design, architectural trade-offs, and scalability.',
                    },
                  ].map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setSelectedLevel(level.id as ExperienceLevel)}
                      className={`rounded-2xl p-6 text-left border transition-all ${
                        selectedLevel === level.id
                          ? 'border-primary bg-primary/15 text-white shadow-xl shadow-primary/20 scale-[1.02]'
                          : 'border-white/5 bg-surface-card text-muted-foreground hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <h4 className="text-lg font-bold text-white">{level.title}</h4>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        {level.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: INTERVIEW TYPE */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-black text-white">Select Interview Type</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose what dimension of preparation you want to focus on.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: 'Technical',
                      title: 'Technical Round',
                      desc: 'In-depth conceptual, coding, database, API, and architectural questions specific to the role.',
                    },
                    {
                      id: 'HR / Behavioral',
                      title: 'HR & Behavioral Round',
                      desc: 'Communication, conflict resolution, leadership, strengths, weaknesses, and STAR method analysis.',
                    },
                    {
                      id: 'Mixed',
                      title: 'Mixed (Tech + HR)',
                      desc: 'A well-rounded combination of technical problem solving and cultural/behavioral scenarios.',
                    },
                    {
                      id: 'Resume Based',
                      title: 'Resume Based Interview',
                      desc: 'Questions dynamically extracted from your uploaded projects, tech stacks, and experiences.',
                    },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedType(t.id as InterviewType)}
                      className={`rounded-2xl p-5 text-left border transition-all ${
                        selectedType === t.id
                          ? 'border-primary bg-primary/15 text-white shadow-xl shadow-primary/20'
                          : 'border-white/5 bg-surface-card text-muted-foreground hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <h4 className="text-base font-bold text-white">{t.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {t.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: RESUME UPLOAD */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-black text-white">Upload Your Resume (Optional)</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    The AI extracts your skills and projects to formulate tailored, realistic interview questions.
                  </p>
                </div>

                <ResumeUploader
                  currentResume={resumeData}
                  onResumeParsed={(res) => setResumeData(res)}
                />
              </motion.div>
            )}

            {/* STEP 5: DURATION */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-black text-white">Choose Interview Duration</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select the length of your practice session.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[5, 10, 15, 20].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDurationMinutes(mins)}
                      className={`rounded-2xl p-6 text-center border transition-all ${
                        durationMinutes === mins
                          ? 'border-primary bg-primary/15 text-white shadow-xl shadow-primary/20 scale-[1.03]'
                          : 'border-white/5 bg-surface-card text-muted-foreground hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <Clock className="h-6 w-6 mx-auto text-primary mb-2" />
                      <h4 className="text-2xl font-black text-white">{mins} mins</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        ~{Math.max(3, Math.round(mins / 2))} questions
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 6: AI VOICE */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-black text-white">Choose AI Interviewer Voice</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select your preferred synthesized interviewer voice.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setVoiceGender('female')}
                    className={`rounded-2xl p-6 text-left border transition-all flex items-center gap-4 ${
                      voiceGender === 'female'
                        ? 'border-primary bg-primary/15 text-white shadow-xl shadow-primary/20'
                        : 'border-white/5 bg-surface-card text-muted-foreground hover:border-white/20'
                    }`}
                  >
                    <div className="h-12 w-12 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                      <Bot className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Sarah (Female AI Voice)</h4>
                      <p className="text-xs text-muted-foreground">Clear, articulate, natural cadence</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVoiceGender('male')}
                    className={`rounded-2xl p-6 text-left border transition-all flex items-center gap-4 ${
                      voiceGender === 'male'
                        ? 'border-primary bg-primary/15 text-white shadow-xl shadow-primary/20'
                        : 'border-white/5 bg-surface-card text-muted-foreground hover:border-white/20'
                    }`}
                  >
                    <div className="h-12 w-12 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                      <Bot className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Alex (Male AI Voice)</h4>
                      <p className="text-xs text-muted-foreground">Direct, professional, calm tone</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 7: CONFIRM & LAUNCH */}
            {currentStep === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-white">Interview Summary & Checklist</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your interview will contain approximately 5–10 questions depending on duration.
                  </p>
                </div>

                <div className="rounded-2xl bg-black/40 border border-white/5 p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Target Role</span>
                    <p className="font-bold text-white text-sm mt-0.5">
                      {isCustomRole && customRoleInput ? customRoleInput : selectedRole}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Level</span>
                    <p className="font-bold text-white text-sm mt-0.5">{selectedLevel}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Interview Type</span>
                    <p className="font-bold text-white text-sm mt-0.5">{selectedType}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration</span>
                    <p className="font-bold text-white text-sm mt-0.5">{durationMinutes} Minutes</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Interviewer Voice</span>
                    <p className="font-bold text-white text-sm mt-0.5">
                      {voiceGender === 'female' ? 'Sarah (Female)' : 'Alex (Male)'}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Resume Attached</span>
                    <p className="font-bold text-white text-sm mt-0.5">
                      {resumeData ? 'Yes (Personalized)' : 'No (Standard bank)'}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4 flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <h5 className="font-bold text-white">Microphone & Voice Tips</h5>
                    <p className="text-muted-foreground leading-relaxed">
                      Ensure you are in a quiet room. You can speak your answers via microphone or type them manually at any time.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            {currentStep > 1 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep((prev) => prev - 1)}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                <span>Back</span>
              </Button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentStep((prev) => prev + 1)}
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                variant="glow"
                size="lg"
                onClick={handleStartInterview}
                isLoading={isLaunching}
              >
                <Mic className="h-5 w-5 mr-2" />
                <span>Start Live Interview</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InterviewSetupPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <SetupContent />
    </React.Suspense>
  );
}

