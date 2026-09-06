'use client';

import * as React from 'react';
import {
  FileText,
  Sparkles,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Upload,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { ResumeUploader } from '@/components/resume/resume-uploader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ParsedResume } from '@/types/resume';
import { useToast } from '@/components/ui/toast';

export default function ResumePage() {
  const { toast } = useToast();
  const [resume, setResume] = React.useState<ParsedResume | null>(null);
  const [useForInterviews, setUseForInterviews] = React.useState(true);

  React.useEffect(() => {
    // Default seed resume if none stored yet
    setResume({
      id: 'res-default-1',
      userId: 'demo-user-123',
      fileName: 'Yogesh_Sharma_FullStack_Resume.pdf',
      fileSize: 420 * 1024,
      uploadedAt: '2026-08-25T10:00:00Z',
      parsedText: 'Experienced Full Stack Engineer with background in Next.js, Node.js, and PostgreSQL...',
      skills: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'TypeScript', 'Tailwind CSS', 'Redis', 'Docker', 'REST APIs', 'Git'],
      projects: [
        {
          title: 'Full Stack E-Commerce Platform',
          description: 'Built high-throughput online marketplace with Redis caching, PostgreSQL indexing, and Stripe checkout.',
          technologies: ['Next.js', 'PostgreSQL', 'Redis', 'Tailwind CSS'],
        },
        {
          title: 'Real-Time Collaboration Workspace',
          description: 'Engineered multi-user canvas with WebSockets and OT conflict resolution algorithm.',
          technologies: ['React', 'Node.js', 'WebSockets', 'TypeScript'],
        },
      ],
      experience: [
        {
          role: 'Full Stack Developer Intern',
          company: 'HyperScale Labs',
          duration: '6 Months',
          highlights: [
            'Refactored legacy API endpoints reducing 95th percentile latency from 1.4s to 120ms.',
            'Implemented secure JWT refresh rotation in HttpOnly cookies.',
          ],
        },
      ],
      education: [
        {
          institution: 'National Institute of Technology',
          degree: 'B.Tech in Computer Science & Engineering',
          year: '2025',
        },
      ],
      certifications: ['AWS Certified Solutions Architect (Associate)', 'Meta Front-End Developer Specialization'],
      useForInterviews: true,
    });
  }, []);

  const handleToggle = () => {
    const next = !useForInterviews;
    setUseForInterviews(next);
    toast({
      type: 'info',
      title: next ? 'Resume Personalization Enabled' : 'Resume Personalization Disabled',
      description: next
        ? 'Future mock interviews will formulate questions from your resume projects.'
        : 'Interviews will use standard role question banks.',
    });
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#070711]">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <FileText className="h-7 w-7 text-primary" />
              Resume Hub
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Upload your PDF or DOCX resume to generate custom, project-specific interview scenarios.
            </p>
          </div>
        </div>

        {/* Use for interviews toggle card */}
        {resume && (
          <div className="rounded-3xl bg-surface border border-primary/20 p-5 shadow-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/15 text-primary border border-primary/30 shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Use this resume for personalized interviews</h4>
                <p className="text-xs text-muted-foreground">
                  When enabled, the AI interviewer extracts your projects, frameworks, and architecture decisions.
                </p>
              </div>
            </div>

            <button
              onClick={handleToggle}
              className="text-primary hover:text-white transition-colors"
            >
              {useForInterviews ? (
                <ToggleRight className="h-9 w-9 text-emerald-400" />
              ) : (
                <ToggleLeft className="h-9 w-9 text-muted-foreground" />
              )}
            </button>
          </div>
        )}

        {/* Uploader Section */}
        <div className="rounded-3xl bg-surface border border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white">Upload New or Updated Resume</h3>
          <ResumeUploader
            currentResume={resume}
            onResumeParsed={(parsed) => setResume(parsed)}
          />
        </div>

        {/* Extracted Details Breakdown */}
        {resume && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Extracted Resume Information</h3>

            {/* Skills & Technologies */}
            <div className="rounded-3xl bg-surface border border-white/10 p-6 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Extracted Skills ({resume.skills.length})</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {resume.skills.map((s) => (
                  <Badge key={s} variant="primary">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="rounded-3xl bg-surface border border-white/10 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                <Briefcase className="h-4 w-4 text-secondary" />
                <span>Projects ({resume.projects.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resume.projects.map((p, i) => (
                  <div key={i} className="rounded-2xl bg-black/40 border border-white/5 p-4 space-y-2">
                    <h4 className="text-sm font-bold text-white">{p.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.technologies.map((t) => (
                        <Badge key={t} variant="outline">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experience */}
              <div className="rounded-3xl bg-surface border border-white/10 p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                  <Briefcase className="h-4 w-4 text-purple-400" />
                  <span>Work Experience</span>
                </div>
                {resume.experience.map((exp, i) => (
                  <div key={i} className="space-y-1 text-xs">
                    <p className="font-bold text-white text-sm">{exp.role}</p>
                    <p className="text-primary font-semibold">{exp.company} • {exp.duration}</p>
                    <ul className="space-y-1 pt-1 text-muted-foreground">
                      {exp.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2">
                          <span>•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="rounded-3xl bg-surface border border-white/10 p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                  <GraduationCap className="h-4 w-4 text-emerald-400" />
                  <span>Education</span>
                </div>
                {resume.education.map((edu, i) => (
                  <div key={i} className="space-y-1 text-xs">
                    <p className="font-bold text-white text-sm">{edu.institution}</p>
                    <p className="text-muted-foreground">{edu.degree}</p>
                    <p className="text-emerald-400 font-semibold">Graduation: {edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
