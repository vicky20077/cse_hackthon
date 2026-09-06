'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Lightbulb, Sparkles, BookOpen } from 'lucide-react';
import { InterviewQuestion } from '@/types/interview';
import { Badge } from '@/components/ui/badge';
import { StarAnalysisCard } from './star-analysis-card';
import { getScoreColor } from '@/lib/utils/formatters';

interface QuestionReviewCardProps {
  question: InterviewQuestion;
  index: number;
}

export function QuestionReviewCard({ question, index }: QuestionReviewCardProps) {
  const [isOpen, setIsOpen] = React.useState(index === 0);
  const evalData = question.evaluation;
  const score = evalData?.technicalScore || 8.0;
  const scoreTheme = getScoreColor(score);

  return (
    <div className="rounded-2xl bg-surface border border-white/10 overflow-hidden transition-all shadow-xl">
      {/* Header Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-start justify-between gap-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-primary bg-primary/15 px-2.5 py-0.5 rounded-full border border-primary/20">
              Question {question.questionNumber || index + 1}
            </span>
            <Badge variant="outline">{question.category || 'Technical'}</Badge>
            <Badge variant={question.difficulty === 'Hard' ? 'error' : question.difficulty === 'Medium' ? 'warning' : 'success'}>
              {question.difficulty}
            </Badge>
          </div>
          <h4 className="text-base font-semibold text-white leading-snug">
            {question.question}
          </h4>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className={`px-3 py-1 rounded-xl font-extrabold text-sm border ${scoreTheme.bg} ${scoreTheme.text} ${scoreTheme.border}`}>
            {score.toFixed(1)} / 10
          </div>
          <div className="text-muted-foreground p-1">
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="px-5 pb-6 pt-2 border-t border-white/5 space-y-5">
          {/* Candidate Answer */}
          <div className="rounded-xl bg-black/40 border border-white/5 p-4 space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Candidate Response
            </span>
            <p className="text-sm text-foreground/90 leading-relaxed italic">
              &quot;{question.userAnswer || question.userAudioTranscript || 'No response recorded'}&quot;
            </p>
          </div>

          {/* Scores Matrix */}
          {evalData && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              <div className="rounded-xl bg-surface-card border border-white/5 p-2.5 text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Technical</span>
                <p className="text-sm font-bold text-white mt-0.5">{evalData.technicalScore.toFixed(1)}</p>
              </div>
              <div className="rounded-xl bg-surface-card border border-white/5 p-2.5 text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Communication</span>
                <p className="text-sm font-bold text-white mt-0.5">{evalData.communicationScore.toFixed(1)}</p>
              </div>
              <div className="rounded-xl bg-surface-card border border-white/5 p-2.5 text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Relevance</span>
                <p className="text-sm font-bold text-white mt-0.5">{evalData.relevanceScore.toFixed(1)}</p>
              </div>
              <div className="rounded-xl bg-surface-card border border-white/5 p-2.5 text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Depth</span>
                <p className="text-sm font-bold text-white mt-0.5">{evalData.depthScore.toFixed(1)}</p>
              </div>
              <div className="rounded-xl bg-surface-card border border-white/5 p-2.5 text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Confidence</span>
                <p className="text-sm font-bold text-white mt-0.5">{evalData.confidenceScore.toFixed(1)}</p>
              </div>
              <div className="rounded-xl bg-surface-card border border-white/5 p-2.5 text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Problem Solving</span>
                <p className="text-sm font-bold text-white mt-0.5">{evalData.problemSolvingScore.toFixed(1)}</p>
              </div>
            </div>
          )}

          {/* Strengths & Improvements */}
          {evalData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Good */}
              <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>What Was Good</span>
                </div>
                <ul className="space-y-1.5 text-xs text-emerald-200/80">
                  {evalData.whatWasGood.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <AlertCircle className="h-4 w-4" />
                  <span>What Could Improve</span>
                </div>
                <ul className="space-y-1.5 text-xs text-amber-200/80">
                  {evalData.whatCouldImprove.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* STAR Analysis if present */}
          {evalData?.starAnalysis && (
            <StarAnalysisCard analysis={evalData.starAnalysis} />
          )}

          {/* Ideal Answer Structure */}
          {evalData?.idealAnswerStructure && (
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
                <Lightbulb className="h-4 w-4" />
                <span>Ideal Answer Structure</span>
              </div>
              <pre className="text-xs text-foreground/90 whitespace-pre-line font-sans leading-relaxed">
                {evalData.idealAnswerStructure}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
