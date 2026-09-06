'use client';

import * as React from 'react';
import { Mic, Send, Edit3, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface TranscriptBoxProps {
  transcript: string;
  onChangeTranscript: (text: string) => void;
  onSubmitAnswer: () => void;
  onClearTranscript: () => void;
  onAskHint?: () => void;
  isListening: boolean;
  isSubmitting: boolean;
  isAskingHint?: boolean;
  disabled?: boolean;
}

export function TranscriptBox({
  transcript,
  onChangeTranscript,
  onSubmitAnswer,
  onClearTranscript,
  onAskHint,
  isListening,
  isSubmitting,
  isAskingHint = false,
  disabled = false,
}: TranscriptBoxProps) {
  const [isEditingManually, setIsEditingManually] = React.useState(false);
  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  return (
    <div className="rounded-2xl bg-surface border border-white/10 p-4 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'h-2.5 w-2.5 rounded-full',
              isListening ? 'bg-emerald-400 animate-pulse' : 'bg-muted-foreground'
            )}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {isListening ? 'Candidate Voice Transcript (Live)' : 'Candidate Answer'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{wordCount} words</span>
          <button
            type="button"
            onClick={() => setIsEditingManually(!isEditingManually)}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{isEditingManually ? 'Lock' : 'Type / Edit'}</span>
          </button>
          {transcript && (
            <button
              type="button"
              onClick={onClearTranscript}
              className="text-muted-foreground hover:text-rose-400 transition-colors"
              title="Clear transcript"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Transcript Textarea or Live view */}
      <div className="relative min-h-[100px] max-h-[160px] overflow-y-auto">
        <textarea
          value={transcript}
          onChange={(e) => onChangeTranscript(e.target.value)}
          placeholder={
            isListening
              ? 'Listening to your microphone... Start speaking to formulate your answer.'
              : 'Press the microphone or type your response here...'
          }
          rows={4}
          disabled={disabled || isSubmitting}
          className="w-full resize-none rounded-xl bg-black/40 border border-white/5 p-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans leading-relaxed"
        />
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
        <div className="text-xs text-muted-foreground flex items-center gap-3">
          {isListening ? (
            <span className="text-emerald-400 font-medium">🎤 Recording audio... Finish speaking and submit.</span>
          ) : (
            <span>Speak via mic or edit the transcript before submitting.</span>
          )}

          {onAskHint && (
            <button
              type="button"
              onClick={onAskHint}
              disabled={disabled || isSubmitting || isAskingHint}
              className="text-xs text-amber-400/90 hover:text-amber-300 transition-colors inline-flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20"
            >
              <span>💡 Need a hint?</span>
            </button>
          )}
        </div>

        <Button
          variant="glow"
          size="sm"
          onClick={onSubmitAnswer}
          disabled={disabled || isSubmitting || !transcript.trim()}
          isLoading={isSubmitting}
        >
          <Send className="h-3.5 w-3.5 mr-1.5" />
          <span>Submit Answer</span>
        </Button>
      </div>
    </div>
  );
}
